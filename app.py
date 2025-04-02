from flask import Flask, render_template, request, jsonify
import pyodbc
from threading import Thread
from flask_caching import Cache
from ping3 import ping
import pandas as pd
import logging

app = Flask(__name__)

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

server = 'GTK-001-G023.gig.holdings\\DWH01'
database = 'STG'
username = 'ICT'
password = '=cF6YLD44@t8D)'
connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'

excel_file_path = '/templates/tajhiz.xlsx'

try:
    tajhiz_data = pd.read_excel(excel_file_path)
    required_columns = ['منطقه گندم', 'نام کارشناس تجهیز', 'شماره موبایل کارشناس تجهیز', 
                        'ایمیل کارشناس تجهیز', 'نام مدیر منطقه', 'شماره موبایل مدیر منطقه', 'ایمیل مدیر منطقه']
    if not all(column in tajhiz_data.columns for column in required_columns):
        raise ValueError("ستون‌های مورد نیاز در فایل اکسل وجود ندارند.")
except Exception as e:
    print(f"خطا در خواندن فایل اکسل: {e}")
    tajhiz_data = pd.DataFrame()

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/')
def index():
    return render_template('index.html')

@cache.cached(timeout=300, query_string=True)
@app.route('/check-store', methods=['GET'])
def check_store():
    store_code = request.args.get('storeCode')
    if not store_code:
        return jsonify({'error': 'Store code is required'}), 400

    try:
        logging.debug(f"کد فروشگاه وارد شده: {store_code}")
        conn = pyodbc.connect(connection_string)
        cursor = conn.cursor()
        query = "SELECT * FROM MasterDataStoreIP WHERE StoreCode = ?"
        cursor.execute(query, store_code)
        row = cursor.fetchone()

        if not row:
            return jsonify({'error': 'فروشگاه یافت نشد'}), 404

        data = dict(zip([column[0] for column in cursor.description], row))

        province = data.get('استان', 'N/A')
        city = data.get('شهر', 'N/A')
        wheat_zone = data.get('منطقه گندم', 'N/A')

        logging.debug(f"استان: {province}, شهر: {city}, منطقه گندم: {wheat_zone}")

        equipment_expert = {'name': 'N/A', 'phone': 'N/A', 'email': 'N/A'}
        region_manager = {'name': 'N/A', 'phone': 'N/A', 'email': 'N/A'}

        matching_row = tajhiz_data[tajhiz_data['منطقه گندم'] == wheat_zone]

        if not matching_row.empty:
            logging.debug(f"ردیف مرتبط در فایل اکسل: {matching_row.to_dict(orient='records')}")
            try:
                equipment_expert = {
                    'name': matching_row['نام کارشناس تجهیز'].values[0],
                    'phone': f"0{int(float(matching_row['شماره موبایل کارشناس تجهیز'].values[0]))}" if pd.notna(matching_row['شماره موبایل کارشناس تجهیز'].values[0]) else 'N/A',
                    'email': matching_row['ایمیل کارشناس تجهیز'].values[0]
                }
            except (ValueError, TypeError):
                equipment_expert['phone'] = 'N/A'

            try:
                region_manager = {
                    'name': matching_row['نام مدیر منطقه'].values[0],
                    'phone': f"0{int(float(matching_row['شماره موبایل مدیر منطقه'].values[0]))}" if pd.notna(matching_row['شماره موبایل مدیر منطقه'].values[0]) else 'N/A',
                    'email': matching_row['ایمیل مدیر منطقه'].values[0]
                }
            except (ValueError, TypeError):
                region_manager['phone'] = 'N/A'

        ip_addresses = set()
        ping_results = {}

        def ping_ip(field_name, value):
            try:
                response_time = ping(value, timeout=1)
                status = 'OK' if response_time is not None else 'NOT OK'
            except Exception:
                status = 'NOT OK'
            ping_results[field_name] = {'address': value, 'status': status}

        threads = []
        for field_name, value in data.items():
            if isinstance(value, str) and value.count('.') == 3 and all(part.isdigit() for part in value.split('.')):
                if value not in ip_addresses:
                    ip_addresses.add(value)
                    thread = Thread(target=ping_ip, args=(field_name, value))
                    threads.append(thread)
                    thread.start()

        for thread in threads:
            thread.join()

        sorted_ping_results = dict(sorted(
            ping_results.items(),
            key=lambda item: tuple(map(int, item[1]['address'].split('.')))
        ))

        return jsonify({
            'storeName': data.get('StoreName', 'N/A'),
            'lastStatus': data.get('LastStatus', 'N/A'),
            'province': province,
            'city': city,
            'wheatZone': wheat_zone,
            'equipmentExpert': equipment_expert,
            'regionManager': region_manager,
            'pingResults': sorted_ping_results
        })

    except Exception as e:
        logging.error(f"خطا: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if 'conn' in locals():
            conn.close()

def run_http():
    app.run(host='0.0.0.0', port=80)

def run_https():
    ssl_context = ('fullchain.pem', 'privkey.pem')
    app.run(host='0.0.0.0', port=443, ssl_context=ssl_context)

if __name__ == '__main__':
    Thread(target=run_http).start()
    Thread(target=run_https).start()
