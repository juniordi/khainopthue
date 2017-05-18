var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var cheerio = require('cheerio') //lib de thao tac voi HTML DOM nhu jQuery
var app = express()

app.set('port', (process.env.PORT || 8080))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

var PAGE_ACCESS_TOKEN = "EAAPQqkSEMT8BAIFoSDvW5bCHZAlZABF8jZC2hXb1WphbHlNcPVy55piTLD93O3Ujx9ElPXRHKGTkoooZBooVaDAC3PJFfXRMRs0L0ezG6yD0ndFufwPhMcMMGCcNYxljM7ER45q97FZCweVByZA0anCjVpafLZCnoBdbZBUCQk5b1wZDZD"


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
        "keyword": [" có thể ", [" làm được gì ", " làm gì ", " làm được những gì ", " làm những gì "]],
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
        "keyword": [[" đổi tên file ", " đổi tên tệp tờ khai ", " đổi tên tệp tk ", " đổi tên tờ khai ", " đổi tên tk "]],
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
    },
    {
        "description": "cách ký điện tử",
        "keyword": [" ký điện tử "],
        "answer": ["Bạn xem cách ký tờ khai tại đây https://youtu.be/IMeg6n6reI0, hoặc cách ký giấy nộp tiền tại đây https://youtu.be/ngmUka21pZI"]
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
        "keyword": [[" phiên bản ", " version ", " bản ", " bao nhiêu "]],
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
        "catalogue": [" ihtkk ", " web kekhaithue ", " web kê khai ", " website kekhaithue ", " website kê khai ", " web nhantokhai ", " website nhantokhai"],
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
        "description": "lỗi java",
        "catalogue": [" java "],
        "keyword": [[" lỗi ", " trục trặc "]],
        "answer": ["Nếu java bị lỗi bạn sẽ: Không chọn được tệp tờ khai, không ký được tệp tờ khai, không ký được giấy nộp tiền và không đổi được mật khẩu. Bạn xem hướng dẫn cài và cấu hình java ở đây nhé http://lehoangdieu.blogspot.com/2016/02/thiet-lap-java-e-khai-nop-thue.html"]
    },


    {
        "description": "chữ ký số là gì",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" là gì ", " là cái gì "]],
        "answer": ["Chữ ký số còn được gọi là chứng thư số là một con dấu để xác nhận văn bản này là của của Doanh nghiệp sử dụng để ký vào văn bản. Chữ ký số có hình dạng như một chiếc USB được gọi là USB Token"]
    },
    {
        "description": "chữ ký số lưu những thông tin gì",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" có gì ", " lưu gì ", " thông tin "]],
        "answer": ["Thông tin có trong chữ ký số:\n- Tên của Doanh nghiệp bao gồm: Mã số thuế, Tên Công ty… \n- Số hiệu của chứng thư số (số serial) \n- Thời hạn có hiệu lực của chứng thư số \n- Tên của tổ chức chứng thực chữ ký số \n..."]
    },
    {
        "description": "mua chữ ký số của ai",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" mua ", " bán "], [" của ai ", " của công ty nào ", " ở đâu ", " chỗ nào ", " nơi nào "]],
        "answer": ["Bạn xem danh sách các công ty cung cấp chứng thư số ở đây nhé http://adf.ly/1aE2UO"]
    },
    {
        "description": "Danh sách các công ty cung cấp chữ ký số",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" danh sách công ty ", " danh sách đơn vị ", " danh mục đơn vị ", " danh mục công ty ", " danh sách các công ty ", " danh sách các đơn vị ", " danh sách các đơn vị ", " danh mục các đơn vị "]],
        "answer": ["Bạn xem danh sách các công ty cung cấp chứng thư số ở đây nhé http://adf.ly/1aE2UO"]
    },
    {
        "description": "cài đặt chứng thư số",
        "catalogue": [[" chứng thư số ", " chữ ký số ", " bút ký ", " token ", " ca "]],
        "keyword": [[" cài ", " setup ", " install "]],
        "answer": ["Bạn vào trong chữ ký số (sử dụng như 1 USB), tìm phần mềm cài đặt trong đó. Hoặc vào website của đơn vị cung cấp chữ ký số để tải phần mềm quản lý chữ ký số. Gõ: danh sách công ty cung cấp bút ký để xem danh sách các công ty cung cấp"]
    },



    {
        "description": "phần mềm TNCN",
        "catalogue": [" phần mềm tncn "],
        "keyword": [[" phiên bản ", " download ", " tải ", " là gì "]],
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
        "description": "phiên bản HTQT TNCN",
        "catalogue": [" htqt tncn "],
        "keyword": [[" phiên bản ", " version ", " bản "]],
        "answer": ["Rất tiếc tôi không cập nhập phiên bản HTQT TNCN. Bạn vào đây để download phiên bản mới nhất nhé http://adf.ly/1bPQhy"]
    },
    {
        "description": "Download HTQT TNCN",
        "catalogue": [" htqt tncn "],
        "keyword": [[" download ", " tải "]],
        "answer": ["Bạn vào đây để download HTQT TNCN phiên bản mới nhất nhé http://adf.ly/1bPQhy"]
    },


    {
        "description": "tra cứu tiểu mục",
        "catalogue": [" tiểu mục "],
        "keyword": [" tiểu mục "],
        "answer": ["function:search_tmuc"]
    },

    {
        "description": "tỷ lệ tính tiền chậm nộp",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [" tỷ lệ "],
        "answer": ["Từ hạn nộp đến 30/6/2013: Tính theo tỷ lệ 0,05% (quy định của Luật số 78/2006/QH11)", "Từ ngày 1/7/2013 đến 31/12/2014: tỷ lệ 0,05% kể từ ngày hết thời hạn nộp thuế đến ngày thứ 90; 0,07% kể từ ngày chậm nộp thứ 91 trở đi. (quy định của Luật số 21/2012/QH13)", "Từ ngày 1/1/2015 - 30/6/2016: Tính theo tỷ lệ 0,05% (quy định của Luật số 71/2014/QH13)", "Từ ngày 1/7/2016: Tính theo tỷ lệ 0.03% (quy định của Luật số 106/2016/QH13)", "Theo Thông tư 166/2013/TT-BTC, tiền chậm nộp tiền phạt tính theo mức 0,05%/ngày"]
    },
    {
        "description": "cách tính phạt chậm nộp",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [[" cách tính ", " như nào ", " thế nào ", " kiểu gì ", " hướng dẫn "]],
        "answer": ["Cách tính phạt chậm nộp: Số tiền phạt = Số tiền nợ x tỷ lệ x số ngày chậm nộp", "Bạn có thể nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016. Tôi sẽ tính số tiền phạt chậm nộp cho bạn", "Nếu tính phạt chậm nộp tiền phạt hãy nhập: tính phạt chậm nộp tiền phạt 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    },
    {
        "description": "cách nhập để tính phạt",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [" tính phạt "],
        "answer": ["Ví dụ bạn nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016. Tôi sẽ tính số tiền phạt chậm nộp cho bạn", "Nếu tính phạt chậm nộp tiền phạt hãy nhập: tính phạt chậm nộp tiền phạt 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    },
    {
        "description": "tính phạt chậm nộp",
        "catalogue": [[" chậm nộp ", " nộp chậm "]],
        "keyword": [" tính phạt ", " từ ", " đến "],
        "answer": ["function:tinh_phat"]
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
        "keyword": [[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào ", " cách "]],
        "answer": ["Để khai thuế qua mạng bạn phải:\n- Cài đặt các phần mềm cần thiết.\n- Có chứng thư số\n- Đăng ký tài khoản trên trang http://kekhaithue.gdt.gov.vn \n- Bạn có thể xem cách nộp tại đây https://youtu.be/IMeg6n6reI0"]
    },
    {
        "description": "Đăng ký khai thuế qua mạng như thế nào",
        "catalogue": [[" khai thuế ", " kê khai ", " nộp tờ khai ", " nộp tk ", " gửi tk ", " gửi tờ khai ", " kekhaithue ", " nhantokhai "]],
        "keyword": [" đăng ký ", [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
        "answer": ["Bạn xem cách đăng ký khai thuế qua mạng tại đây https://youtu.be/LWJKaoqtAYI"]
    },
    {
        "description": "gửi tk lỗi",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " kê khai thuế ", " nhận tờ khai ", " nhận tk ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk "]],
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
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " kekhaithue ", " nhantokhai ", " nhận tờ khai ", " nhận tk "],
        "keyword": [" lỗi ", " sai tại dòng ", " xsd "],
        "answer": ["Đây là lỗi cấu trúc của tờ khai. Bạn xem lại các bảng kê của tk", "Các mst trên bảng kê có đúng không: không có dấu cách, có dấu gạch ngang nếu là mst chi nhánh, ...", "TK GTGT theo quy định không cần gửi phụ lục 01-1, 01-2 nữa nên bạn xóa 2 PL này đi", "Nếu không rơi vào 2 trường hợp lỗi trên bạn liên lạc với bộ phận hỗ trợ của CQT để được trợ giúp"]
    },
    {
        "description": "gửi bảng kê word/excel báo lỗi package should contain a content type part",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk ", " kekhaithue ", " nhantokhai ", " nhận tờ khai ", " nhận tk "],
        "keyword": [[" word ", " excel "], " lỗi ", " package should contain a content type part "],
        "answer": ["Bạn vào Control Panel > Click vào Java > Chọn General > Chọn Settings... -> Delete Files... > Nhấn nút OK"]
    },
    {
        "description": "gửi tk báo lỗi hồ sơ chưa đăng ký nộp qua mạng",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " kekhaithue ", " nhantokhai ", " nhận tờ khai ", " nhận tk "],
        "keyword": [" lỗi ", [" hồ sơ chưa đăng ký nộp qua mạng ", " hồ sơ chưa đăng ký qua mạng ", " hồ sơ chưa đăng ký "]],
        "answer": ["Do tờ khai chưa được đăng ký nộp. Bạn vào TÀI KHOẢN > ĐĂNG KÝ TỜ KHAI để đăng ký", "Bạn xem chi tiết tại đây http://lehoangdieu.blogspot.com/2016/02/ang-ky-to-khai-phai-nop-qua-mang.html"]
    },
    {
        "description": "cách gửi bảng kê, thuyết minh BCTC",
        "catalogue": [[" gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk ", " gửi thuyết minh ", " nộp thuyết minh "]],
        "keyword": [[" cách ", " thế nào ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Các bảng kê hoặc thuyết minh BCTC bạn gửi file định dạng word hoặc excel. Cách làm bạn xem tại đây http://lehoangdieu.blogspot.com/2016/02/nop-thuyet-minh-bctc-qua-mang.html"]
    },
    {
        "description": "gửi tk báo lỗi java.lang.null hoặc internal server error",
        "catalogue": [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " kekhaithue ", " nhantokhai ", " nhận tờ khai ", " nhận tk "],
        "keyword": [" lỗi ", [" java . lang ", " internal server "]],
        "answer": ["Nếu website hiển thị thông báo java.lang.null hoặc internal server error thì đây là lỗi của website. Bạn hãy đợi 1 lát nữa rồi vào làm lại"]
    },
    {
        "description": "vào kekhaithue báo lỗi we were unable to return you to...",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " nhận tờ khai ", " nhận tk ", " kê khai thuế "],
        "keyword": [" lỗi ", " we were unable to return you to "],
        "answer": ["Trên trình duyệt bạn chọn TOOLS > COMPATIBILITY VIEW SETTINGS > Nhấn ADD"]
    },
    {
        "description": "vào nộp tk báo đang tải thư viện mà không hiện nút chọn tệp tờ khai",
        "catalogue": [" kekhaithue ", " nhantokhai ", " tải thư viện ", " chọn tệp tờ khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nhận tờ khai ", " nhận tk "],
        "keyword": [[" không có ", " không xuất hiện ", " không hiện ", " không nhìn thấy ", " không thấy "], " chọn tệp tờ khai "],
        "answer": ["Có lẽ bạn bị lỗi java hoặc chưa enable java trên trình duyệt IE. Java không hoạt động thì sẽ không xuất hiện nút CHỌN TỆP TỜ KHAI. Bạn hãy cài lại java phiên bản mới nhất trên trang java.com nhé"]
    },
    {
        "description": "Nộp tk bằng cái gì?",
        "catalogue": [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nhận tờ khai ", " nhận tk "],
        "keyword": [[" sử dụng ", " dùng "], [" trình duyệt ", " cái gì ", " bằng gì "]],
        "answer": ["Bạn có thể sử dụng trình duyệt Internet Explorer để gửi tk.\nVới Firefox, Chrome hoặc Cốc Cốc để GỬI TỜ KHAI qua trang kekhaithue.gdt.gov.vn bạn xem hướng dẫn này nhé http://adf.ly/10096599/ihtkktrenff"]
    },
    {
        "description": "Trang kekhaithue không vào được",
        "catalogue": [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nopthue ", " nộp thuế ", " nhận tờ khai ", " nhận tk "],
        "keyword": [[" không vào được ", " không truy cập được ", " chạy chậm ", " chạy rất chậm "]],
        "answer": ["Đôi khi website kekhaithue.gdt.gov.vn hoặc nopthue.gdt.gov.vn bị quá tải nên có thể khó truy cập"]
    },
    {
        "description": "gửi tk báo lỗi chưa đến thời kỳ làm bc",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " không gửi được tk ", " không gửi được tờ khai ", " không nộp được tk ", " không nộp được tờ khai ", " nhận tờ khai ", " nhận tk "],
        "keyword": [" lỗi ", [" chưa đến thời kỳ ", " chưa đến kỳ "], [" báo cáo ", " bc "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký lại thời gian bắt đầu nộp TK, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Đăng ký tờ khai phải nộp trên trang kekhaithue",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " kê khai ", " nhận tờ khai ", " nhận tk "],
        "keyword": [" đăng ký ", [" đăng ký tờ khai ", " đăng ký tk ", " đăng ký thêm tờ khai ", " đăng ký thêm tk "], [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Ngừng tờ khai phải nộp trên trang kekhaithue",
        "catalogue": [" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " kê khai ", " nhận tờ khai ", " nhận tk "],
        "keyword": [" đăng ký ", [" ngừng tk ", " ngừng tờ khai ", " bỏ tk ", " bỏ tk ", " hủy tk ", " hủy tờ khai "],[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
        "answer": ["Bạn vào ĐĂNG KÝ TỜ KHAI để đăng ký ngừng TK phải nộp, bạn tham khảo cách làm ở đây https://youtu.be/9XZ0nbBuPXM"]
    },
    {
        "description": "Lập tờ khai, đăng ký, gửi và tra cứu kết quả cấp mã người phụ thuộc",
        "catalogue": [[" cấp mã người phụ thuộc ", " cấp mã npt ", " cấp mã số người phụ thuộc ", " cấp mã số npt ", " cấp mã số thuế người phụ thuộc ", " cấp mst npt ", " cấp người phụ thuộc ", " cấp npt "]],
        "keyword": [[" tờ khai ", " đăng ký ", " gửi ", " tra cứu "]],
        "answer": ["Bạn xem hướng dẫn lập tờ khai, đăng ký, gửi và tra cứu kết quả cấp mã người phụ thuộc qua mạng tại đây http://lehoangdieu.blogspot.com/2016/02/lap-to-khai-ang-ky-gui-va-tra-cuu-ket.html"]
    },
    {
        "description": "Lỗi không thể ký được tệp tờ khai",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nhận tờ khai ", " nhận tk "]],
        "keyword": [" lỗi ", [" không thể ký được tệp tờ khai ", " không thể ký được tệp tk ", " không ký được tệp tờ khai ", " không ký được tệp tk ", " không thể ký được tờ khai ", " không thể ký được tk ", " không ký được tờ khai ", " không ký được tk "]],
        "answer": ["Bạn xem cách khắc phục lỗi không thể ký được tệp tờ khai tại đây http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-khong-ky-uoc-tep-to-khai.html"]
    },
    {
        "description": "thông báo Chức năng chỉ hoạt động với tài khoản đăng ký khai và nộp thuế qua hệ thống Khai thuế qua mạng của Tổng cục Thuế",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nhận tờ khai ", " nhận tk "]],
        "keyword": [" lỗi ", " chức năng chỉ hoạt động với tài khoản "],
        "answer": ["Bạn xem cách khắc phục thông báo Chức năng chỉ hoạt động với tài khoản đăng ký khai và nộp thuế qua hệ thống Khai thuế qua mạng của TCT tại đây http://lehoangdieu.blogspot.com/2016/02/thong-bao-chuc-nang-chi-hoat-ong-voi.html"]
    },
    {
        "description": "thay đổi thông tin khai thuế",
        "catalogue": [[" kekhaithue ", " nhantokhai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " khai thuế ", " nhận tờ khai ", " nhận tk "]],
        "keyword": [[" đổi ", " sửa "], " thông tin "],
        "answer": ["Bạn vào TÀI KHOẢN > THAY ĐỔI THÔNG TIN để thay đổi những thông tin như số điện thoại, email, tên người liên hệ, số serial chứng thư số"]
    },








    {
        "description": "Các phần mềm cần cài để khai nộp thuế",
        "catalogue": [" kê khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai nộp thuế ", " khai thuế "],
        "keyword": [" phần mềm ", [" cần thiết ", " cài "]],
        "answer": ["Bạn cần cài những phần mềm sau để khai nộp thuế:\n- HTKK: lập tờ khai\n- iTaxViewer: xem TK\n- Java: đọc và ký TK, chứng từ,...\n- Phần mềm quản lý bút ký\n- Trình duyệt web"]
    },
    {
        "description": "quên mật khẩu khai nộp thuế",
        "catalogue": [" kê khai ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế ", " khai nộp thuế ", " khai thuế ", " kekhaithue ", "khainopthue", " nhantokhai ", " nopthue ", " noptokhai "],
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
        "keyword": [[" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào ", " như nào "]],
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
        "keyword": [" đăng ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách đăng ký nộp thuế tại đây https://youtu.be/kgsTeNWyjQs"]
    },
    {
        "description": "Đăng ký Nộp thuế điện tử với thông tin sai thì phải làm như thế nào",
        "catalogue": [[" nộp thuế ", " nộp tiền "]],
        "keyword": [" đăng ký ", [" sai ", " nhầm "], " thông tin ", [" làm thế nào ", " làm như thế nào ", " như nào "]],
        "answer": [" - Nếu bạn đăng ký nhầm ngân hàng: liên lạc với NH để NH từ chối đăng ký", "- Nếu đăng ký nhầm thông tin như email, số điện thoại:\n+Nếu chưa có tài khoản: Bạn liên lạc với NH để sửa lại thông tin.\n+Nếu đã có tài khoản: Bạn vào TÀI KHOẢN > THAY ĐỔI THÔNG TIN để sửa"]
    },
    {
        "description": "Những NNT nào được tham gia Nộp thuế điện tử?",
        "catalogue": [" nộp thuế "],
        "keyword": [" tham gia ", " được "],
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
        "keyword": [" đăng ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách đăng ký nộp thuế qua mạng tại đây https://youtu.be/kgsTeNWyjQs"]
    },
    {
        "description": "Thay đổi thông tin nộp thuế",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [[" đổi thông tin ", " sửa thông tin ", " thay thông tin "], [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách thay đổi thông tin nộp thuế tại đây https://youtu.be/b8Pjbq3G1vQ"]
    },
    {
        "description": "Lỗi có giấy nộp tiền giống với giấy nộp tiền hiện tại trong 10 ngày gần đây",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [" lỗi ", [" có giấy nộp tiền giống với giấy nộp tiền hiện tại ", " bạn cần tách số tiền "]],
        "answer": ["Bạn xem cách sửa lỗi có giấy nộp tiền giống với giấy nộp tiền hiện tại trong 10 ngày gần đây tại http://lehoangdieu.blogspot.com/2016/02/canh-bao-co-giay-nop-tien-giong-voi.html"]
    },
    {
        "description": "lỗi giấy nộp tiền vượt quá số ký tự của ngân hàng. Đề nghị rút ngắn nội dung ghi chú hoặc tách thành hai giấy nộp tiền",
        "catalogue": [[" nộp thuế ", " nopthue "]],
        "keyword": [" lỗi ", [" giấy nộp tiền vượt quá số ký tự của ngân hàng ", " gnt vượt quá số ký tự của ngân hàng ", " giấy nộp tiền vượt quá số ký tự của nh ", " gnt vượt quá số ký tự của nh ", " giấy nộp tiền vượt quá ký tự của ngân hàng ", " gnt vượt quá ký tự của ngân hàng ", " giấy nộp tiền vượt quá ký tự của nh ", " gnt vượt quá ký tự của nh "]],
        "answer": ["Bạn xem cách sửa lỗi lỗi giấy nộp tiền vượt quá số ký tự của ngân hàng tại http://lehoangdieu.blogspot.com/2016/02/khac-phuc-loi-giay-nop-tien-vuot-qua-so.html"]
    },
    {
        "description": "Hỗ trợ về số tài khoản ngân hàng",
        "catalogue": [[" tài khoản ngân hàng", " tài khoản nh ", " tk ngân hàng ", " tk nh"]],
        "keyword": [[" tài khoản ngân hàng", " tài khoản nh ", " tk ngân hàng ", " tk nh"]],
        "answer": ["Số tài khoản ngân hàng là số tài khoản tại ngân hàng của bạn. Để thay đổi, thêm mới tài khoản này bạn hãy liên lạc với ngân hàng. Nếu muốn đăng ký nhiều số tài khoản 1 lúc thì khi đăng ký bạn nhập mỗi tài khoản cách nhau bởi dấu chấm phẩy (;)"]
    },
    {
        "description": "không ký được tờ khai/giấy nộp tiền",
        "catalogue": [" không ký được ", " không thể ký được ", " không ký điện tử được ", " không thể ký điện tử được "],
        "keyword": [" không ký được ", " không thể ký được ", " không ký điện tử được ", " không thể ký điện tử được "],
        "answer": ["Có lẽ bạn bị lỗi java nên không thể ký được. Bạn hãy gõ: \"cách cài đặt java\" hoặc \"cách nâng cấp java\" để được hướng dẫn cài đặt/nâng cấp"]
    },


    {
        "description": "Tra cứu giấy nộp tiền",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [[" tra cứu ", " tìm "], [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn vào TRA CỨU > TRA CỨU GIẤY NỘP TIỀN để tra cứu giấy nộp tiền đã gửi thành công hay chưa. Bạn xem chi tiết tại đây https://youtu.be/01lb6LcPFjs"]
    },
    {
        "description": "Trình ký giấy nộp tiền",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [" trình ký ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách trình ký giấy nộp tiền tại đây https://youtu.be/hK3UR0vv76w"]
    },
    {
        "description": "Lập giấy nộp tiền nộp thay",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [" nộp thay ", [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Chức năng lập giấy nộp tiền nộp thay dùng để nộp thay tiền thuế cho DN khác. Bạn xem cách lập giấy nộp tiền nộp thay tại đây https://youtu.be/l46eaayXsZM"]
    },
    {
        "description": "Lập giấy nộp tiền",
        "catalogue": [[" giấy nộp tiền ", " chứng từ "]],
        "keyword": [[" tạo ", " lập ", " khai ", " làm "], [" thế nào ", " cách ", " hướng dẫn ", " kiểu gì ", " như nào "]],
        "answer": ["Bạn xem cách lập giấy nộp tiền tại đây https://youtu.be/ngmUka21pZI"]
    },




    {
        "description": "Tra cứu tờ khai",
        "catalogue": [[" tra cứu tờ khai ", " tra cứu tk ", " tìm tờ khai ", " tìm tk "]],
        "keyword": [[" tra cứu tờ khai ", " tra cứu tk ", " tìm tờ khai ", " tìm tk "]],
        "answer": ["Bạn vào TRA CỨU > TRA CỨU TỜ KHAI để tra cứu các tờ khai đã gửi cho cơ quan thuế. Bạn xem chi tiết tại đây https://youtu.be/crP8SxyLb3A"]
    },


    {
        "description": "Tra cứu thông báo nộp thuế",
        "catalogue": [[" thông báo nộp thuế ", " tb nộp thuế ", " xác nhận nộp thuế ", " thông báo nộp tiền ", " tb nộp tiền ", " xác nhận nộp tiền "]],
        "keyword": [[" thông báo nộp thuế ", " tb nộp thuế ", " xác nhận nộp thuế ", " thông báo nộp tiền ", " tb nộp tiền ", " xác nhận nộp tiền "]],
        "answer": ["Thông báo nộp thuế đã thành công hay chưa bạn có thể vào email hoặc vào TRA CỨU > TRA CỨU THÔNG BÁO để xem. Thông báo ở email và thông báo trên trang web có giá trị như nhau. Bạn xem chi tiết cách tra cứu tại đây https://youtu.be/T9LztT_iVMA"]
    },

    {
        "description": "Tra cứu thông báo nộp tk",
        "catalogue": [[" thông báo nộp tờ khai ", " tb nộp tờ khai ", " xác nhận nộp tờ khai ", " thông báo nộp tk ", " tb nộp tk ", " xác nhận nộp tk "]],
        "keyword": [[" thông báo nộp tờ khai ", " tb nộp tờ khai ", " xác nhận nộp tờ khai ", " thông báo nộp tk ", " tb nộp tk ", " xác nhận nộp tk "]],
        "answer": ["Thông báo nộp tờ khai đã thành công hay chưa bạn có thể vào email hoặc vào TRA CỨU > TRA CỨU THÔNG BÁO để xem. Thông báo ở email và thông báo trên trang web có giá trị như nhau. Bạn xem chi tiết cách tra cứu tại đây https://youtu.be/crP8SxyLb3A"]
    }

]

var a_tieumuc = [
    {"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1001", "tentieumuc": "Thuế thu nhập từ tiền lương, tiền công của người lao động Việt Nam"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1003", "tentieumuc": "Thuế thu nhập từ hoạt động sản xuất, kinh doanh của cá nhân"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1004", "tentieumuc": "Thuế thu nhập từ đầu tư vốn của cá nhân"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1005", "tentieumuc": "Thuế thu nhập từ chuyển nhượng vốn"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1006", "tentieumuc": "Thuế thu nhập từ chuyển nhượng bất động sản"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1007", "tentieumuc": "Thuế thu nhập từ trúng thưởng"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1008", "tentieumuc": "Thuế thu nhập từ bản quyền, nhượng quyền thương mại"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1012", "tentieumuc": "Thuế thu nhập từ thừa kế, quà biếu, quà tặng khác trừ bất động sản"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1014", "tentieumuc": "Thuế thu nhập từ dịch vụ cho thuê nhà, cho thuê mặt bằng"},
{"muc": "1000", "tenmuc": "Thuế thu nhập cá nhân", "tieumuc": "1049", "tentieumuc": "Thuế thu nhập cá nhân khác"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1051", "tentieumuc": "Thuế thu nhập doanh nghiệp của các đơn vị hạch toán toàn ngành (Hạch toán phần thu nhập nộp ngân sách nhà nước từ các hoạt động sản xuất, kinh doanh thực hiện hạch toán tập trung của Tập đoàn Điện lực Việt Nam, các Công ty Điện lực I,II,III, Công ty Điện lực thành phố Hà Nội, Công ty Điện lực thành phố Hồ Chí Minh, Công ty Điện lực Hải Phòng, Công ty Điện lực Đồng Nai; Ngân hàng Công thương Việt Nam, Ngân hàng Nông nghiệp và Phát triển nông thôn Việt Nam, Ngân hàng Ngoại thương Việt Nam, Ngân hàng Đầu tư và Phát triển Việt Nam, Ngân hàng Chính sách xã hội, Ngân hàng Phát triển nhà Đồng bằng Sông Cửu Long; Hãng hàng không Quốc gia Việt Nam; Tập đoàn Bưu chính Viễn thông Việt Nam; Tập đoàn Bảo Việt; Tổng công ty Đường sắt Việt Nam)"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1052", "tentieumuc": "Thuế thu nhập doanh nghiệp của các đơn vị không hạch toán toàn ngành"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1053", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động chuyển quyền sử dụng đất"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1054", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động chuyển quyền thuê đất"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1055", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động chuyển nhượng vốn"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1056", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động thăm dò, phát triển mỏ và khai thác dầu, khí thiên nhiên ( không kê thuế thu nhập doanh nghiệp thu theo hiệp định, hợp đồng thăm dò, khai thác dầu khí )"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1057", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động SXKT"}

]

var a_sorry = 'Rất tiếc vì tôi chưa có dữ liệu bạn cần. Hãy thông cảm là tôi chỉ hiểu câu hỏi khi bạn viết tiếng Việt có dấu và hạn chế viết tắt nhé. Bạn có thể gõ "Trợ giúp" để xem hướng dẫn'
var url_htkk = 'http://www.gdt.gov.vn/wps/portal/home/hotrokekhai'
var item_show = 5 //số câu hỏi trợ giúp sẽ hiển thị nếu ko tìm thấy câu trả lời ng dùng đưa vào

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
    var str_result = []
    str_result.push("Tôi có thể trợ giúp những vẫn đề liên quan đến khai nộp thuế, như:")
    for (var i = a.length-1; i >= a.length-Number(value); i--){
        str_result.push(a[i]["description"])
    }
    str_result.push("Trường hợp dùng ứng dụng bị lỗi bạn hãy ghi rõ lỗi từ ứng dụng nào, ví dụ: Gửi tk báo lỗi không thể ký được tệp tờ khai, gửi tk báo lỗi java.lang.null, khi nộp thuế bị lỗi có giấy nộp tiền giống với giấy nộp tiền hiện tại trong 10 ngày gần đây, khi nộp thuế báo lỗi lỗi giấy nộp tiền vượt quá số ký tự của ngân hàng, ...")
    str_result.push("Bạn có thể xem video hướng dẫn tại https://www.youtube.com/playlist?list=PL9JVxqAVc8XMGC2wpPCXCuvKTT3Bc99G4")
    return str_result
}
function good_str(str) {
    //good_str("a.b") => a . b
    //good_str("a,b") => a , b
    //good_str("a?b") => a ? b
    //good_str("a!b") => a ! b
    //good_str("a;b") => a ; b
    //good_str("a.  b") => a .  b
    var str_tmp = (((((str.replace(/\s{2,}/g," ")).replace(/\./g, " . ")).replace(/,/g, " , ")).replace(/\;/g, " ; ")).replace(/\?/g, " ? ")).replace(/\!/g, " ! ")
    
    var a_keyword = ['noptokhai', 'nop to khai', 'nop tk', 'nộp tờ khai', 'nộp tk', 'nhantokhai', 'nhan to khai', 'nhan tk', 'nhận tờ khai', 'nhận tk', 'ke khai thue', 'kê khai thuế']; // --> 'kekhaithue'
    a_keyword.map(function(val, key){
        var my_regex = new RegExp(val, "g")
        if (my_regex.test(str_tmp))
            str_tmp = str_tmp.replace(my_regex, 'kekhaithue')
    })
    return str_tmp
}
function number_format(str){ //number_format(1000) => 1.000
    str = str.toString()
    if (str.trim() === "") return ""
    var str_to_array = str.split("")
    var array_len = str_to_array.length
    var kq = ""
    var j = 1
    for (var i = array_len-1; i>=0; i--){
        var add_dot = (j%3 === 0 && i !== 0)?".":""
        kq = kq + str_to_array[i] + add_dot
        j++
    }

    str_to_array = kq.split("")
    kq = ""
    array_len = str_to_array.length
    for (var i = array_len-1; i>=0; i--){
        kq = kq + str_to_array[i]
    }

    return kq
}
function search_tmuc(str, obj){
    var tieumuc_len = obj.length
    var str_done = " "+((((((((str.replace("tiểu mục"," ")).replace("là gì", " ")).replace("là cái gì", " ")).replace("là bao nhiêu"," ")).replace("gtgt", "giá trị gia tăng")).replace("tndn", "thu nhập doanh nghiệp")).replace("tncn", "thu nhập cá nhân")).replace("tra cứu", " ")).trim()+" "
    var kq = []
    var flag = 0
    
    for (var i = 0; i < tieumuc_len; i++){
        if (str_done.indexOf(obj[i]["tieumuc"]) != -1) {
            kq.push(i)
            flag = 1
            break           
        }
    }
    if (flag === 0) {
        for (var i = 0; i < tieumuc_len; i++){
            if (str_done.indexOf(obj[i]["muc"]) != -1) {
                kq.push(i)          
                flag = 2
            }
        }
    }
    if (flag === 0) {
        for (var i = 0; i < tieumuc_len; i++){
            if ((" "+(obj[i]["tenmuc"]).toLowerCase()+" ").indexOf(str_done) != -1) {
                kq.push(i)
                flag = 3           
            }
        }
    }
    if (flag === 0) {
        for (var i = 0; i < tieumuc_len; i++){
            if ((" "+(obj[i]["tentieumuc"]).toLowerCase()+" ").indexOf(str_done) != -1) {
                kq.push(i)          
                flag = 4
            }
        }
    }

    return kq
}
function milliseconds2date(num){
    var x = new Date(num)
    return x.getDate() + "/" + (x.getMonth()+1) + "/" + x.getFullYear()
}
function tinh_phat(str){
    //str = tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 31/12/2016
    var day_field
    var month_field
    var year_field

    var tu_ngay
    var tu_ngay_tmp
    var den_ngay
    var den_ngay_tmp
    var so_tien

    var kq = []
    var patt1 = /(từ ngày|từ) \d{1,2}\/\d{1,2}\/\d{4}/
    var patt1_1 = /(từ ngày|từ) \d{1,2}-\d{1,2}-\d{4}/
    if (patt1.test(str)){
        kq.push(str.match(patt1)[0])
        tu_ngay_tmp = str.match(patt1)[0].replace(/(từ ngày|từ) /, "")
    } else if (patt1_1.test(str)){
        kq.push(str.match(patt1_1)[0])
        tu_ngay_tmp = (str.match(patt1_1)[0].replace(/(từ ngày|từ) /, "")).replace(/-+/g, "/")
        
    } else return ["Bạn chưa có ngày bắt đầu tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    
    day_field = tu_ngay_tmp.split("/")[0]
    month_field = tu_ngay_tmp.split("/")[1]
    year_field = tu_ngay_tmp.split("/")[2]
    tu_ngay = new Date(year_field, Number(month_field)-1, day_field)
    if (tu_ngay.getMonth()+1 != Number(month_field) || tu_ngay.getDate() != day_field || tu_ngay.getFullYear() != year_field) return ["Bạn xác định sai ngày bắt đầu tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    //tu_ngay co gia tri hop le
    
    var patt2 = /(đến ngày|đến) \d{1,2}\/\d{1,2}\/\d{4}/
    var patt2_1 = /(đến ngày|đến) \d{1,2}-\d{1,2}-\d{4}/
    if (patt2.test(str)){
        kq.push(str.match(patt2)[0])
        den_ngay_tmp = str.match(patt2)[0].replace(/(đến ngày|đến) /, "")
    } else if (patt2_1.test(str)){
        kq.push(str.match(patt2_1)[0])
        den_ngay_tmp = (str.match(patt2_1)[0].replace(/(đến ngày|đến) /, "")).replace(/-+/g, "/")
        
    } else return ["Bạn chưa có ngày kết thúc tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    
    day_field = den_ngay_tmp.split("/")[0]
    month_field = den_ngay_tmp.split("/")[1]
    year_field = den_ngay_tmp.split("/")[2]
    den_ngay = new Date(year_field, Number(month_field)-1, day_field)
    if (den_ngay.getMonth()+1 != Number(month_field) || den_ngay.getDate()!=day_field || den_ngay.getFullYear()!=year_field) return ["Bạn xác định sai ngày kết thúc tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    //den_ngay co gia tri hop le

    var str_tmp = (str.replace(kq[0]," ")).replace(kq[1]," ")  //remove: tu ngay dd/mm/yyyy & den ngay dd/mm/yyyy
    
    var patt = /(\d+(\.|,)*)+ /
    if (patt.test(str_tmp)){
        var patt_daucham = /\./
        var patt_dauphay = /,/
        if (patt_daucham.test(str_tmp) === true && patt_dauphay.test(str_tmp) === true) return ["Bạn nhập sai số tiền tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
        kq.push(str_tmp.match(patt)[0])
        so_tien = (str_tmp.match(patt)[0].replace(/\.|,/g,"")).trim()
    } else return ["Bạn phải nhập số tiền tính phạt. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]
    //so_tien co gia tri hop le

    var minutes = 1000 * 60
    var hours = minutes * 60
    var days = hours * 24

    var tu_ngay_parse = Date.parse(tu_ngay)
    var den_ngay_parse = Date.parse(den_ngay)

    var so_ngay_tinh_phat = Math.round(den_ngay_parse/days) - Math.round(tu_ngay_parse/days) + 1
    if (so_ngay_tinh_phat < 1) return ["Số ngày tính phạt của bạn có vấn đề: ngày kết thúc tính phạt phải hơn ngày bắt đầu tính. Ví dụ cách nhập: tính phạt chậm nộp 15.000.000 từ ngày 01/01/2016 đến 30/6/2016"]

    var ty_le_003 = 0.0003

    /*bat dau tinh phat chi tiet */
    var ty_le_005 = 0.0005
    var ty_le_007 = 0.0007

    var nam_2013 = new Date(2013, 5, 30) //Từ hạn nộp đến 30/6/2013: Tính theo tỷ lệ 0,05% (quy định của Luật số 78/2006/QH11)
    var nam_2014 = new Date(2014, 11, 31) //Từ ngày 1/7/2013 đến 31/12/2014: Khoản nợ <90 ngày tính theo tỷ lệ 0,05%; Khoản nợ >=90 ngày tính theo tỷ lệ 0,07% (quy định của Luật số 21/2012/QH13)
    var nam_2016 = new Date(2016, 5, 30) //Từ ngày 1/1/2015 - 30/6/2016: Tính theo tỷ lệ 0,05% (quy định của Luật số 71/2014/QH13). Từ ngày 1/7/2016: Tính theo tỷ lệ 0.03% (quy định của Luật số 106/2016/QH13)
    
    var nam_2013_convert = Math.round(Date.parse(nam_2013)/days) //30/6/2013
    var nam_2014_convert = Math.round(Date.parse(nam_2014)/days) //31/12/2014
    var nam_2016_convert = Math.round(Date.parse(nam_2016)/days) //30/6/2016

    var tu_ngay_convert = Math.round(tu_ngay_parse/days)
    var den_ngay_convert = Math.round(den_ngay_parse/days)

    //var tmp_so_ngay
    var tmp_so_tien_phat

    kq = [] //reset array kq
    patt = /(nộp chậm tiền phạt|chậm nộp tiền phạt)/ //pattern phát hiện tính phạt tiền thuế hay tiền phạt tiền phạt
    if (patt.test(str)) { //nếu tính phạt tiền phạt
        tmp_so_tien_phat = Number(so_tien) * (den_ngay_convert - tu_ngay_convert + 1) * ty_le_005
        kq.push('Theo Thông tư 166/2013/TT-BTC, tiền chậm nộp tiền phạt tính theo mức 0,05%/ngày')
        kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
    } else {

        //chia thanh cac giai doan thoi gian [ ;30/6/2013] [1/7/2013; 31/12/2014] [1/1/2015; 30/6/2016] [1/7/2016; ]

        if (tu_ngay_convert > nam_2016_convert) { //Nếu A >= 01/7/2016 --> B >= 01/7/2016: 0.03%
            tmp_so_tien_phat = Number(so_tien) * (den_ngay_convert - tu_ngay_convert + 1) * ty_le_003
            kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
        } else if (nam_2014_convert+1 <= tu_ngay_convert && tu_ngay_convert <= nam_2016_convert) { //Neu 01/01/2015 <= A <= 30/6/2016
            if (den_ngay_convert >= nam_2016_convert+1) { //Nếu B >= 01/7/2016
                //tmp = (nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005
                tmp_so_tien_phat = (nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //tu ngay - 30/6/2016:0.05%, 1/7/2016 - den ngay: 0.03%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005))
                kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003))
            } else { //B nam cung giai doan voi A --> B - A + 1
                tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
            }

        } else if (nam_2013_convert+1 <= tu_ngay_convert && tu_ngay_convert <= nam_2014_convert) { //Neu 1/7/2013 <= A <= 31/12/2014
            if (nam_2013_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2014_convert) { //neu B nam cung giai doan voi A
                if (den_ngay_convert - tu_ngay_convert + 1 <= 90) { //neu <= 90 ngay
                    tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 //B - A + 1
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
                } else {
                    tmp_so_tien_phat = 90 * Number(so_tien) * ty_le_005 + (den_ngay_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007 //tu ngay - 90:0.05%, tu ngay 91 - den ngay: 0.07%
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date((tu_ngay_convert+89)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005))
                    kq.push(milliseconds2date((tu_ngay_convert+90)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert - 90 + 1) + "x0,07% = " + number_format((den_ngay_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007))
                }
            } else if (nam_2014_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2016_convert) { //neu 1/1/2015 <= B <= 30/6/2016
                if (nam_2014_convert - tu_ngay_convert + 1 <= 90) { //neu <= 90 ngay
                    tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 //B-A+1
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
                } else {
                    tmp_so_tien_phat = 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007 + (den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 //90 ngay dau: 0.05%, tu ngay 91 - 31/12/2014: 0.07%, 1/1/2015 - den ngay: 0.05%
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date((tu_ngay_convert+89)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005))
                    kq.push(milliseconds2date((tu_ngay_convert+90)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - tu_ngay_convert - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007))
                    kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005))
                }
            } else if (den_ngay_convert > nam_2016_convert) { //neu B >= 1/7/2016
                if (nam_2014_convert - tu_ngay_convert + 1 <= 90) { //neu <= 90 ngay
                    tmp_so_tien_phat = (nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //tu ngay - 30/6/2016: 0.05%, 1/7/2016 - den ngay: 0.03%
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2016_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005))
                    kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003))
                } else {
                    tmp_so_tien_phat = 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007 + (nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //90 ngay dau: 0.05%, tu ngay 91 - 31/12/2014: 0.07%, 1/1/2015 - 30/6/2016: 0.05%, 1/7/2016 - den ngay: 0.03%
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date((tu_ngay_convert+89)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005))
                    kq.push(milliseconds2date((tu_ngay_convert+90)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - tu_ngay_convert - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - tu_ngay_convert - 90 + 1) * Number(so_tien) * ty_le_007))
                    kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005))
                    kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003))
                }
            }
        } else if (tu_ngay_convert <= nam_2013_convert) {//neu A <= 30/6/2013
            if (den_ngay_convert <= nam_2013_convert) {//neu B nam cung giai doan voi A: 0.05%
                tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
            } else if (nam_2013_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2014_convert) { //neu 1/7/2013 <= B <= 31/12/2014: co tinh 0.05 va 0.07
                //tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 
                if ((nam_2013_convert+1) + 90 >= den_ngay_convert) { //neu <= 90 ngay
                    tmp_so_tien_phat = (den_ngay_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 //tat ca deu la 0.05% 
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format(tmp_so_tien_phat))
                } else {
                    tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 90 * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2013_convert+1) -90 + 1) * Number(so_tien) * ty_le_007 //tu ngay - 30/6/2013: 0.05%, 1/7/2013 - 90 ngay: 0.05%, tu ngay 91 - den ngay: 0.07%
                    kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2013_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2013_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005)) //tu ngay - 30/6/2013: 0.05%
                    kq.push(milliseconds2date((nam_2013_convert+1)*days) + "-" + milliseconds2date((nam_2013_convert+90)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005)) //1/7/2013 - 90 ngay: 0.05%
                    kq.push(milliseconds2date((nam_2013_convert+91)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2013_convert+1) -90 + 1) + "x0,07% = " + number_format((den_ngay_convert - (nam_2013_convert+1) -90 + 1) * Number(so_tien) * ty_le_007)) //tu ngay 91 - den ngay: 0.07%
                }
            } else if (nam_2014_convert+1 <= den_ngay_convert && den_ngay_convert <= nam_2016_convert) { //neu 1/1/2015 <= B <= 30/6/2016
                tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007 + (den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 //tu ngay - 30/6/2013: 0.05%, 1/7/2013 - 90 ngay: 0.05%, 91 ngay - 31/12/2014: 0.07%, 1/1/2015 - den ngay: 0.05%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2013_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2013_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005)) //tu ngay - 30/6/2013: 0.05%
                kq.push(milliseconds2date((nam_2013_convert+1)*days) + "-" + milliseconds2date((nam_2013_convert+90)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005)) //1/7/2013 - 90 ngay: 0.05%
                kq.push(milliseconds2date((nam_2013_convert+91)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007)) //91 ngay - 31/12/2014: 0.07%
                kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((den_ngay_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005)) //1/1/2015 - den ngay: 0.05%
            } else if (den_ngay_convert > nam_2016_convert) {//neu B >= 1/7/2016
                tmp_so_tien_phat = (nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005 + 90 * Number(so_tien) * ty_le_005 + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007 + (nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005 + (den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003 //tu ngay - 30/6/2013: 0.05%, 1/7/2013 - 90 ngay: 0.05%, 91 ngay - 31/12/2014: 0.07%, 1/1/2015 - 30/6/2016: 0.05%, 1/7/2016 - den ngay: 0.03%
                kq.push(milliseconds2date(tu_ngay_parse) + "-" + milliseconds2date(nam_2013_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2013_convert - tu_ngay_convert + 1) + "x0,05% = " + number_format((nam_2013_convert - tu_ngay_convert + 1) * Number(so_tien) * ty_le_005)) //tu ngay - 30/6/2013: 0.05%
                kq.push(milliseconds2date((nam_2013_convert+1)*days) + "-" + milliseconds2date((nam_2013_convert+90)*days) + ":" + number_format(so_tien) + "x90x0,05% = " + number_format(90 * Number(so_tien) * ty_le_005)) //1/7/2013 - 90 ngay: 0.05%
                kq.push(milliseconds2date((nam_2013_convert+91)*days) + "-" + milliseconds2date(nam_2014_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2014_convert - (nam_2013_convert+1) - 90 + 1) + "x0,07% = " + number_format((nam_2014_convert - (nam_2013_convert+1) - 90 + 1) * Number(so_tien) * ty_le_007)) //91 ngay - 31/12/2014: 0.07%
                kq.push(milliseconds2date((nam_2014_convert+1)*days) + "-" + milliseconds2date(nam_2016_convert*days) + ":" + number_format(so_tien) + "x" + (nam_2016_convert - (nam_2014_convert+1) + 1) + "x0,05% = " + number_format((nam_2016_convert - (nam_2014_convert+1) + 1) * Number(so_tien) * ty_le_005)) //1/1/2015 - 30/6/2016: 0.05%
                kq.push(milliseconds2date((nam_2016_convert+1)*days) + "-" + milliseconds2date(den_ngay_parse) + ":" + number_format(so_tien) + "x" + (den_ngay_convert - (nam_2016_convert+1) + 1) + "x0,03% = " + number_format((den_ngay_convert - (nam_2016_convert+1) + 1) * Number(so_tien) * ty_le_003)) //1/7/2016 - den ngay: 0.03%

            }
        }
    }
    kq.push("TỔNG TIỀN PHẠT NỘP CHẬM: " + number_format(Math.round(tmp_so_tien_phat)))

    return kq

    /*ket thuc tinh phat chi tiet*/

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


// Index route
app.get('/', function (req, res) {
    res.send('Access https://m.me/khainopthue to chat')
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

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page. 
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
app.post('/webhook', function (req, res) {
  var data = req.body;



  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;


      // Iterate over each messaging event
      /*pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else if (messagingEvent.read) {
          receivedMessageRead(messagingEvent);
        } else if (messagingEvent.account_linking) {
          receivedAccountLink(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });*/
      pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've 
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message' 
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some 
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've 
 * created. If we receive a message with an attachment (image, video, audio), 
 * then we'll simply confirm that we've received the attachment.
 * 
 */
function receivedMessage(event) {
  var sender = event.sender.id; //var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  /*console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));*/

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  /*
  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s", 
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }
  */

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    /*
    switch (messageText) {
      case 'image':
        sendImageMessage(senderID);
        break;

      case 'gif':
        sendGifMessage(senderID);
        break;

      case 'audio':
        sendAudioMessage(senderID);
        break;

      case 'video':
        sendVideoMessage(senderID);
        break;

      case 'file':
        sendFileMessage(senderID);
        break;

      case 'button':
        sendButtonMessage(senderID);
        break;

      case 'generic':
        sendGenericMessage(senderID);
        break;

      case 'receipt':
        sendReceiptMessage(senderID);
        break;

      case 'quick reply':
        sendQuickReply(senderID);
        break;        

      case 'read receipt':
        sendReadReceipt(senderID);
        break;        

      case 'typing on':
        sendTypingOn(senderID);
        break;        

      case 'typing off':
        sendTypingOff(senderID);
        break;        

      case 'account linking':
        sendAccountLinking(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    } */
    /*if (messageText === "postback") {
        for (var i = 0; i < 10; i++){
          sendPostback(senderID, a_catalogue[i]["description"], i)
        }
    }*/ //else { //bat dau xu ly cau hoi

        /*start*/
        //sender = event.sender.id
        //if (event.message && event.message.text) {
            text = " " + good_str((messageText).toLowerCase()) + " "

            var a_len = a.length
            var a_catalogue_len = a_catalogue.length
            var a_item = -1 //vi tri item cua a_catalogue
            var normal_item = -1 //vi tri item cua a
            var keyword_num = 0 //so tu khoa tim duoc cua a_catalogue
            var keyword_result = 0 //tong so tu khoa cua a_catalogue

            var keyword_num_normal = 0 //so tu khoa tim duoc cua a
            var keyword_result_normal = 0 //tong so tu khoa cua a

            var a_kq_tim_trong_catalogue = []

            for (var i = 0; i < a_catalogue_len; i++) {
                if (check(text, a_catalogue[i]["catalogue"]) > 0) {
                    //cho vao 1 mang nếu tìm đúng catalogue
                    a_kq_tim_trong_catalogue.push(i)

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
            if (a_item < 0 && normal_item < 0) {//ko tim thay
                if (a_kq_tim_trong_catalogue.length > 0) {
                    sendTextMessage(sender, "Tôi chưa có dữ liệu bạn tìm. Dưới đây là các kết quả tương tự")
                    sendGenericMessage(sender, a_kq_tim_trong_catalogue, item_show)
                } else sendTextMessage(sender, a_sorry)         
            } else {
                var array_item = a_item >= 0 ? a_catalogue[a_item]["answer"] : a[normal_item]["answer"]
                
                if (array_item[0] === "function:help"){
                    sendTextMessages(sender, help(a_catalogue, 5), 0)
                } else if (array_item[0] === "function:htkk_version"){
                    request(url_htkk, function(err, response, body){  
                        if (!err && response.statusCode == 200) {
                            var $ = cheerio.load(body)
                            var txt = $('.news > div > a').text().trim()
                        
                            sendTextMessage(sender, 'Phiên bản HTKK hiện tại đang là ' + txt.substr(txt.lastIndexOf(" "),txt.length-txt.lastIndexOf(" ")) + ' được nâng cấp ' + $('.news > div > span').text() + '\nTải phiên bản HTKK mới nhất tại http://adf.ly/1aAYdJ')
                        }
                        else sendTextMessage(sender, 'Không xem được phiên bản của HTKK do kết nối tới máy chủ lỗi')
                    })
                } else if (array_item[0] === "function:search_tmuc") {

                    var search_tm = search_tmuc(text, a_tieumuc)
                    var search_tm_len = search_tm.length
                    var kq_tim_tmuc = []
                    if (search_tm_len === 0){
                        sendTextMessage(sender, "Tôi không tìm thấy tiểu mục này. Bạn xem danh sách đầy đủ tại đây http://adf.ly/1biHZ7")
                    } else {
                        if (search_tm_len > 30) {
                            //sendTextMessage(sender, "Có quá nhiều kết quả nên tôi chỉ liệt kê 1 phần. Bạn hãy giới hạn lại từ khóa tìm kiếm")
                            kq_tim_tmuc.push("Có quá nhiều kết quả nên tôi chỉ liệt kê 1 phần. Bạn hãy giới hạn lại từ khóa tìm kiếm")
                            search_tm_len = 29
                        }
                        for (var i = 0; i < search_tm_len; i++){
                            //sendTextMessage(sender, a_tieumuc[search_tm[i]]["tieumuc"]+" - "+a_tieumuc[search_tm[i]]["tentieumuc"])
                            kq_tim_tmuc.push(a_tieumuc[search_tm[i]]["tieumuc"] + " - " + a_tieumuc[search_tm[i]]["tentieumuc"])
                        }
                        kq_tim_tmuc.push("Bạn có thể xem danh sách đầy đủ tại đây http://adf.ly/1biHZ7")
                        sendTextMessages(sender, kq_tim_tmuc, 0)
                    }


                } else if (array_item[0] === "function:tinh_phat") {
                    var result_tinh_phat = tinh_phat(((messageText).toLowerCase()).replace(/\s{2,}/g," "))
                    sendTextMessages(sender, result_tinh_phat, 0)
                } else {
                    sendTextMessages(sender, array_item, 0)
                }
            }

        //}

        /*end*/

        /*if (messageText === "generic") {
            var arr = [1, 2, 3, 4, 5, 6, 7, 8] //tim thay tung nay kq  
            sendGenericMessage(senderID, arr, item_show)
        } else {
            sendTextMessage(senderID, "Toi da nhan duoc");
        }*/
    //}
    //ket thuc xu ly cau hoi
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Rất tiếc, tôi không xử lý những tin nhắn có đính kèm tệp :(");
  }
} //end function receivedMessage



/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;


  /*console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);*/

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  if (payload.substr(-8, 8) === ",xemtiep") {
    var arr_split = payload.split(",")
    arr_split.pop() //delete phan tu "xemtiep" ra khoi mang
    sendGenericMessage(senderID, arr_split, item_show)
  } else {
        var tmp = []
        var tmp_show
        tmp.push("Bạn đã hỏi: " + a_catalogue[payload]["description"])
        for (var i = 0; i < a_catalogue[payload]["answer"].length; i++){
            tmp_show = (a_catalogue[payload]["answer"][i].slice(0,8) === 'function') ? 'Bạn hãy gõ "' + a_catalogue[payload]["description"] + '" để xem câu trả lời' : a_catalogue[payload]["answer"][i]
            tmp.push(tmp_show);
        }
        sendTextMessages(senderID, tmp, 0)
    }
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId, arr, item) { //arr: mang can duyet, item: so ban ghi can hien thi
  var tmp
  var json_tmp = []
  var length_item = (arr.length >= item) ? item : arr.length
  for (var i = 0; i < length_item; i++){
        tmp = '{' +
            '"title":"' + a_catalogue[arr[i]]["description"] + '",' +
            '"subtitle":"",' +
            '"item_url":"",' +
            '"image_url":"https://c4.staticflickr.com/9/8138/29980622835_735846730d.jpg",' +
            '"buttons": [{' +
                       '"type":"postback",' +
                       '"title":"Xem",' +
                       '"payload":' + arr[i] +
                       '}]' +
            '}'
        json_tmp.push(JSON.parse(tmp))

  }
  if (arr.length > item) {
        arr.splice(0, item) //xóa các item đã hiển thị ra khỏi mảng
        tmp = '{' +
            '"title":"Xem các câu hỏi trợ giúp khác",' +
            '"subtitle":"",' +
            '"item_url":"",' +
            '"image_url":"https://c1.staticflickr.com/9/8125/29372298304_a83d9dfc80_o.png",' +
            '"buttons": [{' +
                       '"type":"postback",' +
                       '"title":"Tiếp tục",' +
                       '"payload":"' + arr.join() + ',xemtiep"' +
                       '}]' +
            '}'
        json_tmp.push(JSON.parse(tmp))
  }


  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: json_tmp
        }
      }
    }
  };  

  callSendAPI(messageData);
}


function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:PAGE_ACCESS_TOKEN},
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

function sendTextMessages(sender, text, i) {
    if (i < text.length) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id:sender},
                message: {text:text[i]},
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
            sendTextMessages(sender, text, i+1)
        })
    } else return
}
/*function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}*/

function sendPostback(recipientId, messageText, item){

  var messageData = {
    recipient: {
      id: recipientId
    },

    message:{
      attachment:{
        type:"template",
        payload:{
          template_type:"generic",
          elements:[
            {
              title:messageText,
              item_url:" ",
              image_url:" ",
              subtitle:" ",
              buttons:[
                {
                  type:"postback",
                  title:"Xem",
                  payload:item
                }
              ]
            }
          ]
        }
      }
    }

  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s", 
        recipientId);
      }
    } else {
      console.error(response.error);
    }
  });  
}
