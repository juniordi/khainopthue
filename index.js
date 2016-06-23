var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var cheerio = require('cheerio')
var app = express()

//data
var a = [
    {
        "description": "smile",
        "keyword": [[" :) ", " :D "]],
        "answer": [":)"]
    },
    {
        "description": "like",
        "keyword": [" (y) "],
        "answer": ["(y)"]
    },
    {
        "description": "help",
        "keyword": [" help ", " giúp "],
        "answer": ["function:help"]
    },
    {
        "description": "chào hỏi",
        "keyword": [[" xin chào ", " chào bạn ", " chào anh ", " chào chị ", " chào mày ", " chào ", " hello ", " hey ", " hi ", " 2 ", " how are you ", " how do you do ", " này "]],
        "answer": ["Xin chào! Tôi là một chú ROBOT. Rất vui khi được chat với bạn. Hãy thông cảm là tôi chỉ hiểu câu hỏi khi bạn viết tiếng Việt có dấu và hạn chế viết tắt nhé :)"]
    },
    {
        "description": "hỏi: bạn là ai",
        "keyword": [[" mày là ai ", " bạn là ai ", " anh là ai ", " chị là ai ", " chú là ai ", " bác là ai ", " cụ là ai "]],
        "answer": ["Tôi là một chú ROBOT kekhaithue"]
    },
    {
        "description": "hỏi: tôi là ai",
        "keyword": [[" tao là ai ", " tôi là ai ", " tớ là ai ", " mình là ai "]],
        "answer": ["Bạn là khách của tôi"]
    },
    {
        "description": "hỏi: ai làm ra mày",
        "keyword": [[" ai làm ra ", " ai tạo ra ", " ai lập trình "]],
        "answer": [":) I can't talk right now"]
    },
    
    {
        "description": "Người dùng nói OK/ yeah",
        "keyword": [[" ok ", " uki ", " yeah "]],
        "answer": ["Cool. Bạn muốn đặt câu hỏi nào nữa không?"]
    },
    {
        "description": "Người dùng nói thế à/ thế á",
        "keyword": [[" thế à ", " thế á "]],
        "answer": ["Yeah! Bạn muốn đặt câu hỏi nào nữa không?"]
    },
    {
        "description": "Người dùng khen",
        "keyword": [[" giỏi đấy ", " giỏi lắm ", " khá khen ", " good ", " tốt "]],
        "answer": ["Cám ơn bạn. Ngại quá <3"]
    },
    {
        "description": "trả lời khi nói cám ơn",
        "keyword": [[" thanks ", " thankyou ", " thank ", " thank you ", " thank-you ", " cám ơn ", " cảm ơn "]],
        "answer": ["Cám ơn bạn đã sử dụng kekhaithue fanpage"]
    },
    
    {
        "description": "Bạn có thể làm gì?",
        "keyword": [" có thể ", [" làm được gì ", " làm gì "]],
        "answer": ["Tôi có thể hướng dẫn căn bản cách khai và nộp thuế. Gõ \"help\" hoặc \"trợ giúp\" để biết cách sử dụng nhé"]
    },
    {
        "description": "hỏi chung chung về Phần mềm",
        "keyword": [" phần mềm "],
        "answer": ["Tôi không hiểu ý bạn. Bạn hãy hỏi nhưng câu cụ thể như: HTKK là gì? Tải HTKK ở đâu? Phiên bản HTKK hiện là bao nhiêu? iTaxViewer là gì? Cài java để làm gì? ..."]
    },
    {
        "description": "hỏi chung chung về Phần mềm",
        "keyword": [" phần mềm teamviewer ", " teamviewer "],
        "answer": ["Teamviewer là phần mềm dùng để điều khiển từ xa, hiện tôi không hỗ trợ được những vấn đề liên quan đến phần mềm này"]
    },
    {
        "description": "Số PIN là gì",
        "keyword": [[" số pin là gì ", " pin là gì ", " mã pin là gì "]],
        "answer": ["Số PIN hay mã PIN là mật khẩu của chữ ký số"]
    },
    {
        "description": "báo sai số PIN",
        "keyword": [[" pin sai ", " sai pin ", " sai số pin "]],
        "answer": ["Bạn đăng nhập vào phần mềm quản lý bút ký để kiểm tra lại số PIN. Nếu không nhớ số PIN hãy liên lạc với công ty cung cấp chữ ký số"]
    },
    
    {
        "description": "hỏi có được đổi tên file tk không",
        "keyword": [" đổi tên ", [" file ", " tệp tờ khai ", " tệp tk "]],
        "answer": ["Bạn có thể đổi tên file tờ khai xml khi gửi qua trang kekhaithue.gdt.gov.vn", "Nếu gửi tờ khai qua trang tncnonline.com.vn thì bạn không được đổi tên file"]
    },
    {
        "description": "gửi tk pdf",
        "keyword": [[" tờ khai pdf ", " tk pdf "]],
        "answer": ["Tờ khai định dạng pdf chỉ được gửi qua trang kekhaithue đến hết tháng 3/2015. Sau thời điểm này mọi tờ khai gửi phải là định dạng xml. Riêng các bảng kê hoặc thuyết minh BCTC thì vẫn gửi văn bản định dạng word hoặc excel"]
    },
    {
        "description": "gửi tk xml",
        "keyword": [[" tờ khai xml ", " tk xml "]],
        "answer": ["Tờ khai định dạng xml bắt đầu được gửi từ tháng 4/2015. Riêng các bảng kê hoặc thuyết minh BCTC thì vẫn gửi văn bản định dạng word hoặc excel. Để đọc file tờ khai này bạn cài phần mềm iTaxViewer"]
    },
    {
        "description": "cài đặt ngày tháng",
        "keyword": [[" ngày tháng ", " ngày giờ "], [" cài đặt ", " thiết lập "]],
        "answer": ["Bạn làm tương tự như này http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-sai-ngay-thang-nam-sinh.html"]
    },
    {
        "description": "tra cứu mst",
        "keyword": [[" tra cứu mst ", " tra cứu mã số thuế ", " tra mst ", " tra mã số thuế "]],
        "answer": ["Bạn vào http://adf.ly/1bRiIX hoặc http://adf.ly/1bRiNn để tra cứu mst"]
    }

]
//data catalogue
var a_catalogue = [
    {
        "description": "htkk là gì",
        "catalogue":[" htkk "],
        "keyword": [[" là gì ", " giới thiệu ", " là cái gì "]],
        "answer": ["Ứng dụng HTKK thuộc bản quyền của Tổng cục thuế. Đây là phần mềm được phát hành miễn phí cho các cơ sở SXKD nhằm hỗ trợ các đơn vị trong quá trình kê khai thuế", "Bạn có thể hỏi: phiên bản mới nhất của HTKK là bao nhiêu? để biết phiên bản mới nhất", "Tải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ"]
    },
    {
        "description": "phiên bản htkk",
        "catalogue":[" htkk "],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["function:htkk_version"]
    },
    {
        "description": "download htkk",
        "catalogue":[" htkk "],
        "keyword": [[" download ", " tải "]],
        "answer": ["Bạn tải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ"]
    },
    {
        "description": "sử dụng htkk lỗi",
        "catalogue":[" htkk "],
        "keyword": [[" lập tk ", " lập tờ khai ", " làm tk ", " làm tờ khai ", " khai tk ", " khai tờ khai "], " lỗi "],
        "answer": ["Bạn hãy mô tả chi tiết lỗi nhé. VD: vào HTKK báo lỗi error, lập tk bổ sung trên htkk báo lỗi error, không vào được htkk, bctc không nhập được số âm trên htkk..."]
    },
    {
        "description": "vào htkk báo lỗi error",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", " error "],
        "answer": ["Bạn xem lại quyền user trên máy tính sử dụng đã đủ quyền chưa? Hoặc bạn phải restart lại máy tính sau khi cài đặt HTKK"]
    },
    {
        "description": "lập tk bổ sung trên htkk báo lỗi error",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", " error ", [" tk ", " tờ khai "], [" bổ sung ", " bổ xung "]],
        "answer": ["Vào lập tk bổ sung trên HTKK bị lỗi error thì bạn xem lại định dạng ngày tháng trên máy tính nhé","Làm tương tự như này http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-sai-ngay-thang-nam-sinh.html"]
    },
    {
        "description": "HTKK không nhập được số âm",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", [" không nhập được số âm ", " không nhập số âm được "]],
        "answer": ["Bạn khắc phục như ở đây http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-khong-nhap-uoc-so-am-tren.html. Nếu vẫn không nhập được số âm thì lỗi do HTKK"]
    },
    {
        "description": "HTKK không nhập được số âm trên BCTC",
        "catalogue":[" htkk "],
        "keyword": [" lỗi ", [" không nhập được số âm ", " không nhập số âm được "], [" báo cáo tài chính ", " bctc "]],
        "answer": ["Bạn khắc phục như ở đây http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-khong-nhap-uoc-so-am-tren.html. Nếu vẫn không nhập được số âm thì lỗi do HTKK"]
    },
    {
        "description": "không vào được HTKK",
        "catalogue": [" htkk "],
        "keyword": [" lỗi ", [" không vào ", " đứng im "]],
        "answer": ["Bạn khắc phục như ở đây http://lehoangdieu.blogspot.com/2016/02/nhap-mst-nhung-khong-vao-uoc-htkk.html"]
    },
    {
        "description": "HTKK báo lỗi chưa đến thời kỳ làm bc",
        "catalogue": [" htkk "],
        "keyword": [" lỗi ", [" chưa đến thời kỳ ", " chưa đến kỳ "], [" làm báo cáo ", " làm bc "]],
        "answer": ["Bạn xem lại năm tài chính đã khai báo trên HTKK (vào HỆ THỐNG > THÔNG TIN DN) hoặc ngày tháng trên máy tính bạn đang bị sai"]
    },
    {
        "description": "Cài đặt ngày tháng để sử dụng HTKK như ý",
        "catalogue": [" htkk "],
        "keyword": [[" ngày tháng ", " ngày giờ "], [" cài đặt ", " thiết lập "]],
        "answer": ["Bạn làm tương tự như này http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-sai-ngay-thang-nam-sinh.html"]
    },
    {
        "description": "Cài đặt ngày tháng để sử dụng HTKK như ý",
        "catalogue": [" htkk "],
        "keyword": [[" cài ", " setup "]],
        "answer": ["Bạn tải HTKK tại http://adf.ly/1aAYdJ, cài đặt thì dễ lắm, cứ Next next next OK là xong :)"]
    },


    {
        "description": "itaxviewer là gì",
        "catalogue":[[" itaxviewer ", " itaxview ", " itax "]],
        "keyword": [[" là gì ", " giới thiệu ", " là cái gì "]],
        "answer": ["iTaxViewer là ứng dụng hỗ trợ đọc, xác minh tờ khai, thông báo thuế định dạng XML. Tải phiên bản mới nhất tại đây http://adf.ly/1aAYfe"]
    },
    {
        "description": "phiên bản itaxviewer",
        "catalogue":[[" itaxviewer ", " itaxview ", " itax "]],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["Tôi chưa cập nhật phiên bản mới nhất của iTaxViewer là bao nhiêu, nhưng bạn có thể tải phiên bản mới nhất tại http://adf.ly/1aAYfe"]
    },
    {
        "description": "download itaxviewer",
        "catalogue":[[" itaxviewer ", " itaxview ", " itax "]],
        "keyword": [[" download ", " tải "]],
        "answer": ["Tải phiên bản mới nhất itaxviewer tại http://adf.ly/1aAYfe"]
    },
    {
        "description": "ihtkk là gì",
        "catalogue": [" ihtkk "],
        "keyword": [[" là gì ", " giới thiệu ", " là cái gì ", " website ", " trang web "]],
        "answer": ["iHTKK là hệ thống kê khai thuế, nộp tờ khai thuế thông qua trang web của Tổng Cục Thuế http://kekhaithue.gdt.gov.vn"]
    },
    {
        "description": "phiên bản ihtkk",
        "catalogue": [" ihtkk "],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["Bạn vào trang http://kekhaithue.gdt.gov.vn và xem góc trên phải của trang để biết phiên bản hiện tại ihtkk nhé.\nTôi rất tiếc vì sự bất tiện này"]
    },
    {
        "description": "download ihtkk",
        "catalogue": [" ihtkk "],
        "keyword": [[" download ", " tải "]],
        "answer": ["iHTKK là hệ thống kê khai thuế, nộp tờ khai thuế thông qua trang web của Tổng Cục Thuế http://kekhaithue.gdt.gov.vn. Bạn không cần download :)"]
    },
    {
        "description": "chức năng của java",
        "catalogue": [" java "],
        "keyword": [[" chức năng ", " mục đích ", " tác dụng "], " cài ", [" làm gì ", " để làm gì ", " sao "]],
        "answer": ["Java có tác dụng trong khai và nộp thuế điện tử: Dùng để chọn tệp tờ khai, ký tệp tờ khai, ký giấy nộp tiền và xác nhận để đổi mật khẩu"]
    },
    {
        "description": "cài đặt java",
        "catalogue": [" java "],
        "keyword": [[" cài ", " setup ", " thiết lập ", " cấu hình "]],
        "answer": ["Bạn xem hướng dẫn cài và cấu hình java ở đây nhé http://lehoangdieu.blogspot.com/2016/02/thiet-lap-java-e-khai-nop-thue.html"]
    },
    {
        "description": "nâng cấp java",
        "catalogue": [" java "],
        "keyword": [[" nâng cấp ", " update "]],
        "answer": ["Bạn xem khi nào phải nâng cấp và cách nâng cấp java ở đây https://youtu.be/sAp46t5dxFY"]
    },


    {
        "description": "chữ ký số là gì",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token "]],
        "keyword": [[" là gì ", " là cái gì "]],
        "answer": ["Chữ ký số còn được gọi là chứng thư số là một con dấu để xác nhận văn bản này là của của Doanh nghiệp sử dụng để ký vào văn bản. Chữ ký số có hình dạng như một chiếc USB được gọi là USB Token"]
    },
    {
        "description": "chữ ký số lưu những thông tin gì",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token "]],
        "keyword": [[" có gì ", " lưu gì ", " thông tin "]],
        "answer": ["Thông tin có trong chữ ký số:\n- Tên của Doanh nghiệp bao gồm: Mã số thuế, Tên Công ty… \n- Số hiệu của chứng thư số (số serial) \n- Thời hạn có hiệu lực của chứng thư số \n- Tên của tổ chức chứng thực chữ ký số \n..."]
    },
    {
        "description": "mua chữ ký số của ai",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token "]],
        "keyword": [[" mua ", " bán "], [" của ai ", " của công ty nào ", " ở đâu ", " chỗ nào ", " nơi nào "]],
        "answer": ["Bạn xem danh sách các công ty cung cấp chứng thư số ở đây nhé http://adf.ly/1aE2UO"]
    },



    {
        "description": "Khai thuế qua mạng là gì?",
        "catalogue": [[" khai thuế qua mạng ", " kê khai qua mạng ", " nộp tờ khai qua mạng ", " nộp tk qua mạng "]],
        "keyword": [" là gì "],
        "answer": ["Khai thuế qua mạng là việc người nộp thuế lập hồ sơ khai thuế trên máy vi tính của mình và gửi hồ sơ đến cơ quan thuế trực tiếp quản lý bằng mạng internet. Khai thuế qua mạng là dịch vụ Thuế điện tử được pháp luật về Thuế quy định"]
    },
    {
        "description": "Khai thuế qua mạng như thế nào",
        "catalogue": [[" khai thuế ", " kê khai ", " nộp tờ khai ", " nộp tk ", " gửi tk ", " gửi tờ khai "]],
        "keyword": [[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào "]],
        "answer": ["Để khai thuế qua mạng bạn phải:\n- Cài đặt các phần mềm cần thiết.\n- Có chứng thư số\n- Đăng ký tài khoản trên trang http://kekhaithue.gdt.gov.vn \n- Bạn có thể xem cách nộp tại đây https://youtu.be/IMeg6n6reI0"]
    },
    {
        "description": "Đăng ký khai thuế qua mạng như thế nào",
        "catalogue": [[" khai thuế ", " kê khai ", " nộp tờ khai ", " nộp tk ", " gửi tk ", " gửi tờ khai ", " kekhaithue ", " nhantokhai "]],
        "keyword": [" đăng ký ", [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào "]],
        "answer": ["Bạn xem cách đăng ký khai thuế qua mạng tại đây https://youtu.be/LWJKaoqtAYI"]
    },
    {
        "description": "gửi tk lỗi",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk "]],
        "keyword":[[" không được ", " lỗi "]],
        "answer": ["Bạn hãy mô tả chi tiết lỗi gặp phải nhé. VD như: gửi tk báo lỗi xsd, gửi tk báo lỗi java.lang.null, gửi tk báo lỗi chưa đến thời kỳ làm bc, ..."]
    },
    {
        "description": "Không gửi được tk",
        "catalogue": [[" không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "]],
        "keyword":[[" không gửi được tk ", " không gửi được tờ khai "]],
        "answer": ["Bạn hãy mô tả chi tiết lỗi gặp phải nhé. VD như: gửi tk báo lỗi xsd, gửi tk báo lỗi java.lang.null, gửi tk báo lỗi chưa đến thời kỳ làm bc, ..."]
    },
    {
        "description": "gửi tk báo lỗi phiên bản tk không đúng",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", " phiên bản "],
        "answer": ["Bạn hãy tải HTKK phiên bản mới nhất về cài đặt, sau đó kết xuất tờ khai gửi lại", "Tải HTKK mới nhất tại đây http://adf.ly/1aAYdJ"]
    }, 
    {
        "description": "gửi tk báo lỗi xsd",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", " sai tại dòng ", " xsd "],
        "answer": ["Đây là lỗi cấu trúc của tờ khai. Bạn xem lại các bảng kê của tk", "Các mst trên bảng kê có đúng không: không có dấu cách, có dấu gạch ngang nếu là mst chi nhánh, ...", "TK GTGT theo quy định không cần gửi phụ lục 01-1, 01-2 nữa nên bạn xóa 2 PL này đi", "Nếu không rơi vào 2 trường hợp lỗi trên bạn liên lạc với bộ phận hỗ trợ của CQT để được trợ giúp"]
    },
    {
        "description": "gửi bảng kê word/excel báo lỗi package should contain a content type part",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk "],
        "keyword": [[" word ", " excel "], " lỗi ", " package should contain a content type part "],
        "answer": ["Bạn vào Control Panel > Click vào Java > Chọn General > Chọn Settings... -> Delete Files... > Nhấn nút OK"]
    },
    {
        "description": "gửi tk báo lỗi hồ sơ chưa đăng ký nộp qua mạng",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", [" hồ sơ chưa đăng ký nộp qua mạng ", " hồ sơ chưa đăng ký qua mạng ", " hồ sơ chưa đăng ký "]],
        "answer": ["Do tờ khai chưa được đăng ký nộp. Bạn vào TÀI KHOẢN > ĐĂNG KÝ TỜ KHAI để đăng ký", "Bạn xem chi tiết tại đây http://lehoangdieu.blogspot.com/2016/02/ang-ky-to-khai-phai-nop-qua-mang.html"]
    },
    {
        "description": "cách gửi bảng kê, thuyết minh BCTC",
        "catalogue": [[" gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk ", " gửi thuyết minh ", " nộp thuyết minh "]],
        "keyword": [[" cách ", " thế nào ", " hướng dẫn ", " kiểu gì "]],
        "answer": ["Các bảng kê hoặc thuyết minh BCTC bạn gửi file định dạng word hoặc excel. Cách làm bạn xem tại đây http://lehoangdieu.blogspot.com/2016/02/nop-thuyet-minh-bctc-qua-mang.html"]
    },
    {
        "description": "gửi tk báo lỗi java.lang.null hoặc internal server error",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", [" java . lang ", " internal server "]],
        "answer": ["Nếu website hiển thị thông báo java.lang.null hoặc internal server error thì đây là lỗi của website. Bạn hãy đợi 1 lát nữa rồi vào làm lại"]
    },
    {
        "description": "vào kekhaithue báo lỗi we were unable to return you to...",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", " we were unable to return you to "],
        "answer": ["Trên trình duyệt bạn chọn TOOLS > COMPATIBILITY VIEW SETTINGS > Nhấn ADD"]
    },
    {
        "description": "vào nộp tk báo đang tải thư viện mà không hiện nút chọn tệp tờ khai",
        "catalogue": [" kekhaithue ", " nhantokhai ", " tải thư viện ", " chọn tệp tờ khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "],
        "keyword": [[" không có ", " không xuất hiện ", " không hiện ", " không nhìn thấy ", " không thấy "], " chọn tệp tờ khai "],
        "answer": ["Có lẽ bạn bị lỗi java hoặc chưa enable java trên trình duyệt IE. Java không hoạt động thì sẽ không xuất hiện nút CHỌN TỆP TỜ KHAI. Bạn hãy cài lại java phiên bản mới nhất trên trang java.com nhé"]
    },
    {
        "description": "Nộp tk bằng cái gì?",
        "catalogue": [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "],
        "keyword": [[" sử dụng ", " dùng "], [" trình duyệt ", " cái gì ", " bằng gì "]],
        "answer": ["Bạn có thể sử dụng trình duyệt Internet Explorer để gửi tk.\nVới Firefox, Chrome hoặc Cốc Cốc để GỬI TỜ KHAI qua trang kekhaithue.gdt.gov.vn bạn xem hướng dẫn này nhé http://adf.ly/10096599/ihtkktrenff"]
    },
    {
        "description": "Trang kekhaithue không vào được",
        "catalogue": [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nopthue ", " nộp thuế "],
        "keyword": [[" không vào được ", " không truy cập được ", " chạy chậm ", " chạy rất chậm "]],
        "answer": ["Đôi khi website kekhaithue.gdt.gov.vn hoặc nopthue.gdt.gov.vn bị quá tải nên có thể khó truy cập"]
    },
    {
        "description": "gửi tk báo lỗi chưa đến thời kỳ làm bc",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai "],
        "keyword": [" lỗi ", [" chưa đến thời kỳ ", " chưa đến kỳ "], [" báo cáo ", " bc "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký lại thời gian bắt đầu nộp TK, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Đăng ký tờ khai phải nộp trên trang kekhaithue",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "],
        "keyword": [[" đăng ký ", " thêm "],[" tk ", " tờ khai "],[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Ngừng tờ khai phải nộp trên trang kekhaithue",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "],
        "keyword": [" đăng ký ", [" ngừng tk ", " ngừng tờ khai ", " bỏ tk ", " bỏ tk ", " hủy tk ", " hủy tờ khai "],[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký ngừng TK phải nộp, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },


    {
        "description": "Các phần mềm cần cài để khai nộp thuế",
        "catalogue": [" kê khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai nộp thuế ", " khai thuế "],
        "keyword": [" phần mềm ", [" cần thiết ", " cài "]],
        "answer": ["Bạn cần cài những phần mềm sau để khai nộp thuế:\n- HTKK: lập tờ khai\n- iTaxViewer: xem TK\n- Java: đọc và ký TK, chứng từ,...\n- Phần mềm quản lý bút ký\n- Trình duyệt web"]
    },
    {
        "description": "quên mật khẩu khai nộp thuế",
        "catalogue": [" kê khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai nộp thuế ", " khai thuế ", " kekhaithue ", " nhantokhai ", " nopthue "],
        "keyword": [[" quên ", " mất ", " lấy lại ", " không nhớ "], [" mật khẩu ", " pass ", " password "]],
        "answer": ["Bạn xem cách lấy lại mật khẩu ở đây http://lehoangdieu.blogspot.com/2016/02/lay-lai-mat-khau-khai-thue-va-nop-thue.html"]
    },
    {
        "description": "Gửi tk hoặc nộp thuế báo lỗi chứng thư số chưa đăng ký với cqt",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai thuế ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " không nộp được thuế "],
        "keyword": [" lỗi ", [" chứng thư số chưa đăng ký ", " chứng thư số không đăng ký ", " chứng thư số đăng ký "]],
        "answer": ["Bạn vào TÀI KHOẢN > THAY ĐỔI THÔNG TIN > Nhấn vào THAY ĐỔI SỐ SERIAL"]
    },
    {
        "description": "Gửi tk hoặc nộp thuế báo lỗi sai số PIN hoặc không tìm thấy chứng thư số",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai thuế ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " không nộp được thuế "],
        "keyword": [" lỗi ", [" sai số pin ", " không tìm thấy chứng thư "]],
        "answer": ["Bạn đã cài phần mềm quản lý chữ ký số chưa? Nếu cài rồi thì bạn vào phần mềm kiểm tra lại số PIN xem có đúng không hay chứng thư có bị khóa không"]
    },
    {
        "description": "báo sai số PIN",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai thuế ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " không nộp được thuế "],
        "keyword": [[" pin sai ", " sai pin ", " sai số pin "]],
        "answer": ["Bạn đăng nhập vào phần mềm quản lý bút ký để kiểm tra lại số PIN. Nếu không nhớ số PIN hãy liên lạc với công ty cung cấp chữ ký số"]
    },
    {
        "description": "Nộp thuế qua mạng là gì",
        "catalogue": [[" nộp thuế qua mạng ", " nộp thuế điện tử "]],
        "keyword": [" là gì "],
        "answer": ["Nộp thuế qua mạng là việc thực hiện các thủ tục nộp tiền vào Ngân sách nhà nước qua mạng máy tính mà không phải trực tiếp đến Ngân hàng hoặc Kho bạc. Nộp thuế qua mạng là dịch vụ Thuế điện tử được pháp luật về Thuế quy định"]
    },
    {
        "description": "Nộp thuế như thế nào",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào "]],
        "answer": ["Để nộp thuế điện tử bạn phải:\n- Cài đặt các phần mềm cần thiết.\n- Có chứng thư số\n- Đăng ký tài khoản trên trang https://nopthue.gdt.gov.vn \n- Xem các video hướng dẫn nộp chi tiết tại đây http://bit.ly/videokhainopthue"]
    },
    {
        "description": "Dùng trình duyệt nào để nộp thuế",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [[" sử dụng ", " dùng "], " trình duyệt "],
        "answer": ["Bạn sử dụng trình duyệt Internet Explorer để nộp tiền thuế qua mạng. Với các trình duyệt Firefox, Chrome hoặc Cốc Cốc phải cài đặt thêm Fire IE như sau http://lehoangdieu.blogspot.com/2016/02/nop-thue-bang-trinh-duyet-firefox.html"]
    },
    {
        "description": "Đăng ký nộp thuế điện tử như thế nào",
        "catalogue": [" nộp thuế "],
        "keyword": [" đăng ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì "]],
        "answer": ["Bạn xem cách đăng ký nộp thuế tại đây https://youtu.be/kgsTeNWyjQs"]
    },
    {
        "description": "Đăng ký Nộp thuế điện tử với thông tin sai thì phải làm như thế nào",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [" đăng ký ", [" sai thông tin ", " nhầm thông tin ", " thông tin sai ", " thông tin nhầm "], [" làm thế nào ", " làm như thế nào "]],
        "answer": [" - Nếu bạn đăng ký nhầm ngân hàng: liên lạc với NH để NH từ chối đăng ký", "- Nếu đăng ký nhầm thông tin như email, số điện thoại:\n+Nếu chưa có tài khoản: Bạn liên lạc với NH để sửa lại thông tin.\n+Nếu đã có tài khoản: Bạn vào TÀI KHOẢN > THAY ĐỔI THÔGN TIN để sửa"]
    },
    {
        "description": "Những NNT nào được tham gia Nộp thuế điện tử?",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [" được ", " tham gia "],
        "answer": ["NNT đảm bảo đầy đủ những điều kiện sau có thể tham gia nộp thuế điện tử: \n - Là tổ chức, doanh nghiệp được cấp mã số thuế và đang hoạt động \n - Có chứng thư số\n - Có kết nối Internet và địa chỉ thư điện tử\n- Có tài khoản tại một trong những Ngân hàng thương mại triển khai nộp thuế với TCT"]
    },
    {
        "description": "NNT đang thực hiện kê khai thuế qua mạng tại các nhà TVAN có tham gia nộp thuế điện tử được không?",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [" khai thuế ", [" tvan ", " t-van "], [" có được ", " có tham gia ", " có thể "]],
        "answer": ["Có bạn nhé. NNT khai thuế qua mạng qua TVAN có thể tham gia nộp thuế điện tử tại nopthue.gdt.gov.vn của TCT"]
    },
    {
        "description": "Chữ ký số được sử dụng trong Nộp thuế điện tử cho thể là chữ ký số được sử dụng Khai thuế qua mạng hay không",
        "catalogue": [" nộp thuế "],
        "keyword": [[" chứng thư số ", " chữ ký số ", " token ", " bút ký "], [" sử dụng ", " dùng trong "], [" khai thuế ", " nộp tờ khai ", " nộp tk "], [" dùng để ", " dùng chung "]],
        "answer": ["Chữ ký số trong nộp thuế và Chữ ký số sử dụng trong khai thuế giống nhau, tuy nhiên vẫn có thể sử dụng hai chữ ký số khác nhau cho hai ứng dụng này, tùy bạn lựa chọn"]
    },
    {
        "description": "NNT được đăng ký sử dụng Nộp thuế điện tử tối đa với bao nhiêu Ngân hàng",
        "catalogue": [" nộp thuế "],
        "keyword": [" đăng ký ", " bao nhiêu ", [" ngân hàng ", " nh "]],
        "answer": ["Bạn có thể đăng ký với tất cả các  ngân hàng đã kết nối với hệ thống của Tổng cục Thuế.\nDanh sách các NH xem tại đây http://adf.ly/10096599/dangkyntdt"]
    },
    {
        "description": "Đăng ký sử dụng nộp thuế điện tử ở đâu?",
        "catalogue": [" nộp thuế "],
        "keyword": [" đăng ký ", [" tại đâu ", " ở đâu ", " ở trang nào ", " tại trang nào ", " cổng thông tin nào ", " cổng nào ", " chỗ nào "]],
        "answer": ["Bạn có thể đăng ký nộp thuế điện tử tại https://nopthue.gdt.gov.vn của TCT hoặc các trang web của các đơn vị TVAN"]
    },
    {
        "description": "Cách đăng ký nộp thuế",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [" đăng ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì "]],
        "answer": ["Bạn xem cách đăng ký nộp thuế qua mạng tại đây https://youtu.be/kgsTeNWyjQs"]
    },




    {
        "description": "phần mềm TNCN",
        "catalogue": [" tncn "],
        "keyword": [[" phần mềm ", " phiên bản ", " download ", " tải ", " là gì "]],
        "answer": ["Hiện nay phần mềm TNCN đã ngừng cung cấp. Để cấp mst cá nhân qua cơ quan chi trả bạn dùng phần mềm HTQT TNCN"]
    },


    {
        "description": "Đăng ký mst cá nhân",
        "catalogue": [[" mst cá nhân ", " mã số thuế cá nhân "]],
        "keyword": [[" đăng ký ", " cấp "]],
        "answer": ["Bạn dùng phần mềm HTQT TNCN (Hỗ trợ quyết toán TNCN) > Chọn ĐĂNG KÝ THUẾ QUA CQCT, sau đó kết xuất ra file xml (không được đổi tên file) rồi gửi qua trang tncnonline.com.vn. Sau đó in 1 bản có đóng dấu gửi đến cơ quan thuế"]
    },


    {
        "description": "HTQT TNCN là gì",
        "catalogue": [" htqt tncn "],
        "keyword": [[" là gì ", " là cái gì ", " giới thiệu "]],
        "answer": ["HTQT TNCN (Hỗ trợ quyết toán TNCN) là phần mềm dùng để khai hồ sơ quyết toán thuế TNCN và hồ sơ xin cấp MST cá nhân qua cơ quan chi trả. Download tại http://adf.ly/1bPQhy"]
    },
    {
        "description": "HTQT TNCN là gì",
        "catalogue": [" htqt tncn "],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["Rất tiếc tôi không cập nhập phiên bản HTQT TNCN. Bạn vào đây để download phiên bản mới nhất nhé http://adf.ly/1bPQhy"]
    },
    {
        "description": "Download HTQT TNCN",
        "catalogue": [" htqt tncn "],
        "keyword": [[" download ", " tải "]],
        "answer": ["Bạn vào đây để download HTQT TNCN phiên bản mới nhất nhé http://adf.ly/1bPQhy"]
    }

]

var a_sorry = "Rất tiếc vì tôi chưa có dữ liệu bạn cần. Hãy thông cảm là tôi chỉ hiểu câu hỏi khi bạn viết tiếng Việt có dấu và hạn chế viết tắt nhé"
var url_htkk = 'http://www.gdt.gov.vn/wps/portal/home/hotrokekhai'

function check(str, obj){ //tim duoc bao nhieu tu khoa trong obj
    var kq = 0
    var obj_len = obj.length
    for (var i = 0; i < obj_len; i++) {
        if (typeof(obj[i]) == "object") {
            kq = kq + check(str, obj[i])
        } else {
            if (str.indexOf(obj[i]) != -1) {
                kq += 1
            }
        }
    }
    return kq
}
function help(a, value){
    var str_result = "Tôi có thể trợ giúp những vẫn đề liên quan đến khai nộp thuế, như:\n"
    for (var i = a.length-1; i >= a.length-Number(value); i--){
        str_result = str_result + "- " + a[i]["description"] + "\n"
    }
    str_result = str_result.substring(0,310) + "\n..."
    return str_result
}
function good_str(str) {
    //good_str("a.b") => a . b
    //good_str("a,b") => a , b
    //good_str("a?b") => a ? b
    //good_str("a!b") => a ! b
    //good_str("a;b") => a ; b
    //good_str("a.  b") => a .  b
    return (((((str.replace(/\s{2,}/g," ")).replace(/\./g, " . ")).replace(/,/g, " , ")).replace(/\;/g, " ; ")).replace(/\?/g, " ? ")).replace(/\!/g, " ! ")
}
/*
//Rất tiếc là làm thành hàm riêng lại ko chạy
function htkk_version(){
    var url_htkk = 'http://www.gdt.gov.vn/wps/portal/home/hotrokekhai'
    var current_version = ''
    request(url_htkk, function(err, response, body){  
      if (!err && response.statusCode == 200) {
        var $ = cheerio.load(body)
        var txt = $('.news > div > a').text().trim()
        
        current_version = 'Phiên bản HTKK hiện tại đang là ' + txt.substr(txt.lastIndexOf(" "),txt.length-txt.lastIndexOf(" ")) + ' được nâng cấp ' + $('.news > div > span').text()
      }
      else current_version = 'Không xem được phiên bản của HTKK do kết nối tới máy chủ lỗi'
    })
    return current_version
}
*/

app.set('port', (process.env.PORT || 8080))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'khai_va_nop_thue') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = " " + good_str((event.message.text).toLowerCase()) + " "

            //bat dau xu ly
            var a_len = a.length
            var a_catalogue_len = a_catalogue.length
            var a_item = -1 //vi tri item cua a_catalogue
            var normal_item = -1 //vi tri item cua a
            var keyword_num = 0 //so tu khoa tim duoc cua a_catalogue
            var keyword_result = 0 //tong so tu khoa cua a_catalogue

            var keyword_num_normal = 0 //so tu khoa tim duoc cua a
            var keyword_result_normal = 0 //tong so tu khoa cua a


            /*for (var i = 0; i < a_len; i++) {
                if (check(text, a[i]["keyword"]) > keyword_num && check(text, a[i]["keyword"]) > 0) {
                    a_item = i
                    keyword_result = a[i]["keyword"].length
                    keyword_num = check(text, a[i]["keyword"])   
                } else if (check(text, a[i]["keyword"]) == keyword_num && check(text, a[i]["keyword"]) > 0) {
                    if (Number(a[i]["keyword"].length) - Number(check(text, a[i]["keyword"])) < Number(keyword_result) - Number(keyword_num)) {
                        a_item = i
                        keyword_result = a[i]["keyword"].length
                        keyword_num = check(text, a[i]["keyword"])
                    }
                }
            }*/
            for (var i = 0; i < a_catalogue_len; i++) {
                if (check(text, a_catalogue[i]["catalogue"]) > 0) {
                    if (check(text, a_catalogue[i]["catalogue"]) > 0 && check(text, a_catalogue[i]["keyword"]) > keyword_num && check(text, a_catalogue[i]["keyword"]) > 0) {
                        a_item = i
                        keyword_result = a_catalogue[i]["keyword"].length
                        keyword_num = check(text, a_catalogue[i]["keyword"])   
                    } else if (check(text, a_catalogue[i]["catalogue"]) > 0 && check(text, a_catalogue[i]["keyword"]) == keyword_num && check(text, a_catalogue[i]["keyword"]) > 0) {
                        if (Number(a_catalogue[i]["keyword"].length) - Number(check(text, a_catalogue[i]["keyword"])) < Number(keyword_result) - Number(keyword_num)) {
                            a_item = i
                            keyword_result = a_catalogue[i]["keyword"].length
                            keyword_num = check(text, a_catalogue[i]["keyword"])
                        }
                    }
                }
            }
            //neu ko tim duoc trong catalogue: tim array a
            if (a_item < 0) {
                for (var i = 0; i < a_len; i++) {
                if (check(text, a[i]["keyword"]) > keyword_num_normal && check(text, a[i]["keyword"]) > 0) {
                    normal_item = i
                    keyword_result_normal = a[i]["keyword"].length
                    keyword_num_normal = check(text, a[i]["keyword"])   
                } else if (check(text, a[i]["keyword"]) == keyword_num_normal && check(text, a[i]["keyword"]) > 0) {
                    if (Number(a[i]["keyword"].length) - Number(check(text, a[i]["keyword"])) < Number(keyword_result_normal) - Number(keyword_num_normal)) {
                            normal_item = i
                            keyword_result_normal = a[i]["keyword"].length
                            keyword_num_normal = check(text, a[i]["keyword"])
                        }
                    }
                }
            }
            if (a_item < 0 && normal_item < 0) {
                sendTextMessage(sender, a_sorry)         
            } else {
                var array_item = a_item >= 0 ? a_catalogue[a_item]["answer"] : a[normal_item]["answer"]
                
                if (array_item[0] == "function:help"){
                    sendTextMessage(sender, help(a_catalogue, 5))
                } else if (array_item[0] == "function:htkk_version"){
                    request(url_htkk, function(err, response, body){  
                        if (!err && response.statusCode == 200) {
                            var $ = cheerio.load(body)
                            var txt = $('.news > div > a').text().trim()
                        
                            sendTextMessage(sender, 'Phiên bản HTKK hiện tại đang là ' + txt.substr(txt.lastIndexOf(" "),txt.length-txt.lastIndexOf(" ")) + ' được nâng cấp ' + $('.news > div > span').text() + '\nTải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ')
                        }
                        else sendTextMessage(sender, 'Không xem được phiên bản của HTKK do kết nối tới máy chủ lỗi')
                    })
                } else {
                    for (var i=0; i < array_item.length; i++){
                            sendTextMessage(sender, array_item[i])
                    }
                }
            }

            /*
            if (a_item < 0) {
                sendTextMessage(sender, a_sorry)
            } else {
                if (a[a_item]["answer"][0] == "function:help"){
                    sendTextMessage(sender, help(a, 5))
                } else if (a[a_item]["answer"][0] == "function:htkk_version"){
                    request(url_htkk, function(err, response, body){  
                        if (!err && response.statusCode == 200) {
                            var $ = cheerio.load(body)
                            var txt = $('.news > div > a').text().trim()
                        
                            sendTextMessage(sender, 'Phiên bản HTKK hiện tại đang là ' + txt.substr(txt.lastIndexOf(" "),txt.length-txt.lastIndexOf(" ")) + ' được nâng cấp ' + $('.news > div > span').text() + '\nTải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ')
                        }
                        else sendTextMessage(sender, 'Không xem được phiên bản của HTKK do kết nối tới máy chủ lỗi')
                    })
                } else {
                    for (var i=0; i < a[a_item]["answer"].length; i++){
                            sendTextMessage(sender, a[a_item]["answer"][i])
                    }
                }
            }*/
            //ket thuc xu ly

            //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

var token = "CAAPPeyZAttj4BAKHkEwoet1mh0Mn6Whm9kfHFDC7CyDDY8YiNcNZAYciJ1Mk0eSAylenejhvh7czbG3PXRpE36HwHj2KowhYyLHWlyZCAABhgQ2sPW8ePXI2wdgrM7rj3xDH8wd8iVJrJie57IXibU58CXEOJHeHCJym54bLFBcD1bxEoqH8GHJfyaAh5BseAu0zLWsvAZDZD"

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}