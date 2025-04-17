import React from 'react';
import html2canvas from 'html2canvas';

class PDFExport extends React.Component {
    exportToPDF = async () => {
        try {
            // اطمینان از بارگذاری jsPDF
            if (typeof window.jspdf === 'undefined') {
                console.error('jsPDF بارگذاری نشده است');
                return;
            }

            const { jsPDF } = window.jspdf;
            
            // انتخاب المان HTML که می‌خواهیم به PDF تبدیل کنیم
            const element = document.getElementById('content-to-export');
            
            // تبدیل HTML به canvas با حفظ رنگ‌ها
            const canvas = await html2canvas(element, {
                scale: 2, // کیفیت بالاتر
                useCORS: true, // برای تصاویر خارجی
                logging: false,
                backgroundColor: '#ffffff',
                allowTaint: true
            });

            // ایجاد PDF
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true
            });

            const imgWidth = 210; // عرض A4
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // اضافه کردن تصویر به PDF
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

            // ذخیره PDF
            pdf.save('exported-document.pdf');
        } catch (error) {
            console.error('خطا در ایجاد PDF:', error);
        }
    };

    render() {
        return (
            <div>
                <button 
                    onClick={this.exportToPDF}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    دانلود PDF
                </button>
                
                {/* این div محتوایی است که به PDF تبدیل می‌شود */}
                <div id="content-to-export" style={{ display: 'none' }}>
                    <div style={{ 
                        padding: '20px',
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        direction: 'rtl',
                        textAlign: 'right'
                    }}>
                        <h1 style={{ color: '#2196F3' }}>عنوان سند</h1>
                        <p style={{ color: '#4CAF50' }}>این یک متن رنگی است</p>
                        <div style={{ 
                            backgroundColor: '#FFC107',
                            padding: '10px',
                            margin: '10px 0'
                        }}>
                            این یک کادر رنگی است
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PDFExport; 