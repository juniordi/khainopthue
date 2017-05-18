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
"{""muc"": ""1050"", ""tenmuc"": ""Thuế thu nhập doanh nghiệp"", ""tieumuc"": ""1051"", ""tentieumuc"": ""Thuế thu nhập doanh nghiệp của các đơn vị hạch toán toàn ngành
(Hạch toán phần thu nhập nộp ngân sách nhà nước từ các hoạt động sản xuất, kinh doanh thực hiện hạch toán tập trung của Tập đoàn Điện lực Việt Nam, các Công ty Điện lực I,II,III, Công ty Điện lực thành phố Hà Nội, Công ty Điện lực thành phố Hồ Chí Minh, Công ty Điện lực Hải Phòng, Công ty Điện lực Đồng Nai; Ngân hàng Công thương Việt Nam, Ngân hàng Nông nghiệp và Phát triển nông thôn Việt Nam, Ngân hàng Ngoại thương Việt Nam, Ngân hàng Đầu tư và Phát triển Việt Nam, Ngân hàng Chính sách xã hội, Ngân hàng Phát triển nhà Đồng bằng Sông Cửu Long; Hãng hàng không Quốc gia Việt Nam; Tập đoàn Bưu chính Viễn thông Việt Nam; Tập đoàn Bảo Việt; Tổng công ty Đường sắt Việt Nam)""},"
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1052", "tentieumuc": "Thuế thu nhập doanh nghiệp của các đơn vị không hạch toán toàn ngành"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1053", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động chuyển quyền sử dụng đất"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1054", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động chuyển quyền thuê đất"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1055", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động chuyển nhượng vốn"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1056", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động thăm dò, phát triển mỏ và khai thác dầu, khí thiên nhiên ( không kê thuế thu nhập doanh nghiệp thu theo hiệp định, hợp đồng thăm dò, khai thác dầu khí )"},
{"muc": "1050", "tenmuc": "Thuế thu nhập doanh nghiệp", "tieumuc": "1057", "tentieumuc": "Thuế thu nhập doanh nghiệp từ hoạt động SXKT"},
{"muc": "1100", "tenmuc": "Thu nợ thuế chuyển thu nhập", "tieumuc": "1101", "tentieumuc": "Thu nợ thuế chuyển thu nhập của các chủ đầu tư nước ngoài ở Việt nam về nước"},
{"muc": "1100", "tenmuc": "Thu nợ thuế chuyển thu nhập", "tieumuc": "1102", "tentieumuc": "Thu nợ thuế chuyển vốn của các chủ đầu tư trong các doanh nghiệp"},
{"muc": "1100", "tenmuc": "Thu nợ thuế chuyển thu nhập", "tieumuc": "1103", "tentieumuc": "Thu nợ thuế chuyển thu nhập của các chủ đầu tư Việt nam ở nước ngoài về nước"},
{"muc": "1100", "tenmuc": "Thu nợ thuế chuyển thu nhập", "tieumuc": "1149", "tentieumuc": "Thu nợ thuế chuyển thu nhập khác"},
{"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1151", "tentieumuc": "Thu nhập sau thuế thu nhập"},
{"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1152", "tentieumuc": "Thu chênh lệch của doanh nghiệp công ích"},
{"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1153", "tentieumuc": "Thu nhập sau thuế thu nhập từ hoạt động xổ số kiến thiết"},
{"muc": "1150", "tenmuc": "Thu nhập sau thuế thu nhập", "tieumuc": "1199", "tentieumuc": "Thu nhập sau thuế thu nhập - Khác"},
{"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1251", "tentieumuc": "Thu tiền cấp quyền khai thác khoáng sản đối với Giấy phép do cơ quan Trung ương cấp"},
{"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1252", "tentieumuc": "Thu tiên câp quyên khai thác khoáng sản đối với Giây phép do Ủy ban nhân dân tỉnh câp phép"},
{"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1254", "tentieumuc": "Thu tiền cấp quyền khai thác tài nguyên nước đối với giấy phép do cơ quan địa phương cấp phép"},
{"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1255", "tentieumuc": "Thu tiền sử dụng khu vực biển"},
{"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1256", "tentieumuc": "Thu tiền cấp quyền hàng không"},
{"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1257", "tentieumuc": "Thu tiền sử dụng rừng, tiền thuê rừng"},
{"muc": "1250", "tenmuc": "Thu tiền cấp quyền khai thác khoáng sản", "tieumuc": "1299", "tentieumuc": "Thu từ các tài nguyên khác"},
{"muc": "1300", "tenmuc": "Thuế sử dụng đất nông nghiệp", "tieumuc": "1301", "tentieumuc": "Đất trồng cây hàng năm"},
{"muc": "1300", "tenmuc": "Thuế sử dụng đất nông nghiệp", "tieumuc": "1302", "tentieumuc": "Đất trồng cây lâu năm"},
{"muc": "1300", "tenmuc": "Thuế sử dụng đất nông nghiệp", "tieumuc": "1349", "tentieumuc": "Đất khác"},
{"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất (Khoản thu nợ thuế chuyển quyền sử dụng đất được hạch toán vào Mục 1350 )", "tieumuc": "1351", "tentieumuc": "Đất ở"},
{"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất (Khoản thu nợ thuế chuyển quyền sử dụng đất được hạch toán vào Mục 1350 )", "tieumuc": "1352", "tentieumuc": "Đất xây dựng"},
{"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất (Khoản thu nợ thuế chuyển quyền sử dụng đất được hạch toán vào Mục 1350 )", "tieumuc": "1353", "tentieumuc": "Đất nông nghiệp"},
{"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất (Khoản thu nợ thuế chuyển quyền sử dụng đất được hạch toán vào Mục 1350 )", "tieumuc": "1354", "tentieumuc": "Đất ngư nghiệp"},
{"muc": "1350", "tenmuc": "Thuế chuyển quyền sử dụng đất (Khoản thu nợ thuế chuyển quyền sử dụng đất được hạch toán vào Mục 1350 )", "tieumuc": "1399", "tentieumuc": "Đất dùng cho mục đích khác"},
{"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1401", "tentieumuc": "Đất ở"},
{"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1402", "tentieumuc": "Đất xây dựng"},
{"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1403", "tentieumuc": "Đất nông nghiệp"},
{"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1404", "tentieumuc": "Đất ngư nghiệp"},
{"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1405", "tentieumuc": "Đất xen kẹp (Phần đất không đủ rộng để cấp đất theo dự án đầu tư)"},
{"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1406", "tentieumuc": "Đất dôi dư (Phần đất khi đo thực tế lớn hơn so với giấy chứng nhận quyền sử dụng đất hoặc so với diện tích đất được cấp có thẩm quyền giao)"},
{"muc": "1400", "tenmuc": "Thu tiền sử dụng đất", "tieumuc": "1449", "tentieumuc": "Đất dùng cho mục đích khác"},
{"muc": "1450", "tenmuc": "Thu giao đất trồng rừng", "tieumuc": "1451", "tentieumuc": "Thu giao đất trồng rừng"},
{"muc": "1450", "tenmuc": "Thu giao đất trồng rừng", "tieumuc": "1499", "tentieumuc": "Thu giao đất trồng rừng - Khác"},
{"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1501", "tentieumuc": "Thuế nhà"},
{"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1502", "tentieumuc": "Thuế đất ở"},
{"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1503", "tentieumuc": "Thuế đất ngư nghiệp"},
{"muc": "1500", "tenmuc": "Thuế nhà, đất", "tieumuc": "1549", "tentieumuc": "Thuế đất khác"},
{"muc": "1550", "tenmuc": "Thuế tài nguyên", "tieumuc": "1551", "tentieumuc": "Dầu, khí (không kể  thuế  tài nguyên thu theo hiệp định, hợp đồng thăm dò khai thác dầu, khí)"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1552", "tentieumuc": "Nước thuỷ điện"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1553", "tentieumuc": "Khoáng sản kim loại"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1554", "tentieumuc": "Khoáng sản quý hiếm (vàng, bạc, đá quý)"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1555", "tentieumuc": "Khoáng sản phi kim loại"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1556", "tentieumuc": "Thuỷ, hải sản"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1557", "tentieumuc": "Sản phẩm rừng tự nhiên"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1558", "tentieumuc": "Nước thiên nhiên khác"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1561", "tentieumuc": "Yên sào thiên nhiên"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1562", "tentieumuc": "Khí thiên nhiên (không kể thuê tài nguyên thu theo hiệp định, hợp đồng)"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1563", "tentieumuc": "Khí than (không kể thuê tài nguyên thu theo hiệp định, hợp đồng)"},
{"muc": "0", "tenmuc": "Thuế tài nguyên", "tieumuc": "1599", "tentieumuc": "Tài nguyên khoáng sản khác"},
{"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1601", "tentieumuc": "Thu từ đất ở tại nông thôn"},
{"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1602", "tentieumuc": "Thu từ đất ở tại đô thị"},
{"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1603", "tentieumuc": "Thu từ đất sản xuất, kinh doanh phi nông nghiệp"},
{"muc": "1600", "tenmuc": "Thuế sử dụng đất phi nông nghiệp", "tieumuc": "1649", "tentieumuc": "Thu từ đất phi nông nghiệp khác"},
{"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1701", "tentieumuc": "Thuế giá trị gia tăng hàng sản xuất, kinh doanh trong nước"},
{"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1702", "tentieumuc": "Thuế giá trị gia tăng hàng nhập khẩu (trừ thuế giá trị gia tăng hàng nhập khẩu qua biên giới đất liền)"},
{"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1703", "tentieumuc": "Thuế giá trị gia tăng hàng nhập khẩu qua biên giới đất liền"},
{"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1704", "tentieumuc": "Thuế giá trị gia tăng từ hoạt động thăm dò, phát triển mỏ và khai thác dầu, khí thiên nhiên ( không kể thuế giá trị gia tăng thu theo hiệp định, hợp đồng thăm dò, khai thác dầu, khí"},
{"muc": "1700", "tenmuc": "Thuế giá trị gia tăng", "tieumuc": "1705", "tentieumuc": "Thuế giá trị gia tăng hoạt động SXKT"},
"{""muc"": ""1700"", ""tenmuc"": ""Thuế giá trị gia tăng"", ""tieumuc"": ""1749"", ""tentieumuc"": ""Khác 
(Bao gồm cả thu nợ về thuế doanh thu.)""},"
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1751", "tentieumuc": "Hàng nhập khẩu (trừ thuế nhập khẩu hàng qua biên giới đất liền)"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1752", "tentieumuc": "Hàng nhập khẩu qua biên giới đất liền"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1753", "tentieumuc": "Mặt hàng thuốc lá điếu, xì gà sản xuất trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1754", "tentieumuc": "Mặt hàng rượu sản xuất trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1755", "tentieumuc": "Mặt hàng ô tô dưới 24 chỗ ngồi sản xuất trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1756", "tentieumuc": "Mặt hàng xăng các loại, nap-ta, chế phẩm tái hợp và các chế phẩm khác để pha chế xăng được sản xuất trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1757", "tentieumuc": "Các dịch vụ, hàng hoá khác sản xuất trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1758", "tentieumuc": "Mặt hàng bia sản xuất trong nước  "},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1761", "tentieumuc": "Thuế tiêu thụ đặc biệt từ hoạt động xổ số kiến thiết"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1762", "tentieumuc": "Thuốc lá, xì gà nhập khâu bán ra trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1763", "tentieumuc": "Rượu nhập khâu bán ra trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1764", "tentieumuc": "Xe ô tô dưới 24 chỗ ngồi các loại nhập khâu bán ra trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1765", "tentieumuc": "Xăng các loại nhập khâu bán ra trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1766", "tentieumuc": "Các dịch vụ, hàng hóa khác nhập khâu bán ra trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1767", "tentieumuc": "Bia nhập khâu bán ra trong nước"},
{"muc": "1750", "tenmuc": "Thuế tiêu thụ đặc biệt", "tieumuc": "1799", "tentieumuc": "Thuế tiêu thụ đặc biệt - Khác"},
{"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1801", "tentieumuc": "Bậc 1"},
{"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1802", "tentieumuc": "Bậc 2"},
{"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1803", "tentieumuc": "Bậc 3"},
{"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1804", "tentieumuc": "Bậc 4"},
{"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1805", "tentieumuc": "Bậc 5"},
{"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1806", "tentieumuc": "Bậc 6"},
{"muc": "1800", "tenmuc": "Thuế môn bài", "tieumuc": "1849", "tentieumuc": "Thuế môn bài - Khác"},
{"muc": "1850", "tenmuc": "Thuế xuất khẩu", "tieumuc": "1851", "tentieumuc": "Thuế xuất khẩu (trừ thuế xuất khẩu qua biên giới đất liền)"},
{"muc": "1850", "tenmuc": "Thuế xuất khẩu", "tieumuc": "1852", "tentieumuc": "Thuế xuất khẩu qua biên giới đất liền"},
{"muc": "1850", "tenmuc": "Thuế xuất khẩu", "tieumuc": "1899", "tentieumuc": "Thuế xuất khẩu - Khác"},
{"muc": "1900", "tenmuc": "Thuế nhập khẩu", "tieumuc": "1901", "tentieumuc": "Thuế nhập khẩu (trừ thuế nhập khẩu qua biên giới đất liền)"},
{"muc": "1900", "tenmuc": "Thuế nhập khẩu", "tieumuc": "1902", "tentieumuc": "Thuế nhập khẩu qua biên giới đất liền"},
"{""muc"": ""1900"", ""tenmuc"": ""Thuế nhập khẩu"", ""tieumuc"": ""1903"", ""tentieumuc"": ""Thuế nhập khẩu bổ sung ( thuế tự vệ)
(Dùng để hoạch toán phần thuế nhập khẩu áp dụng chế độ tự vệ theo quy định của pháp luật)""},"
{"muc": "1900", "tenmuc": "Thuế nhập khẩu", "tieumuc": "1949", "tentieumuc": "Thuế nhập khẩu - Khác"},
{"muc": "1950", "tenmuc": "Thuế bổ sung đối với hàng hoá nhập khẩu vào Việt Nam", "tieumuc": "1951", "tentieumuc": "Thuế chống bán phá giá đối với hàng hoá nhập khẩu vào Việt Nam"},
{"muc": "1950", "tenmuc": "Thuế bổ sung đối với hàng hoá nhập khẩu vào Việt Nam", "tieumuc": "1952", "tentieumuc": "Thuế chống trợ cấp đối với hàng hoá nhập khẩu vào Việt Nam"},
{"muc": "1950", "tenmuc": "Thuế bổ sung đối với hàng hoá nhập khẩu vào Việt Nam", "tieumuc": "1953", "tentieumuc": "Thuế chống phân biệt đối xử đối với hàng hoá nhập khẩu vào Việt Nam"},
{"muc": "1950", "tenmuc": "Thuế bổ sung đối với hàng hoá nhập khẩu vào Việt Nam", "tieumuc": "1999", "tentieumuc": "Thuế bổ sung đối với hàng hoá nhập khẩu vào Việt Nam - Khác"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2001", "tentieumuc": "Thu từ xăng sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2002", "tentieumuc": "Thu từ dầu diezel sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2003", "tentieumuc": "Thu từ dầu hỏa sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2004", "tentieumuc": "Thu từ dầu mazut, dầu mỡ nhờn sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2005", "tentieumuc": "Thu từ than đá sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2006", "tentieumuc": "Thu từ dung dịch hydro, chloro, fluoro, carbon sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2007", "tentieumuc": "Thu từ túi ni lông sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2008", "tentieumuc": "Thu từ thuốc diệt cỏ sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2009", "tentieumuc": "Thu từ nhiên liệu bay sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2019", "tentieumuc": "Thu từ các sản phẩm hàng hóa khác sản xuất trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2031", "tentieumuc": "Thu từ xăng nhập khẩu ( trừ xăng nhập khẩu để bán trong nước)"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2032", "tentieumuc": "Thu từ nhiên liệu bay nhập khẩu (trừ nhiên liệu bay nhập khẩu để bán trong nước)"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2033", "tentieumuc": "Thu từ dầu diezel nhập khẩu (trừ dầu diezel nhập khẩu để bán trong nước)"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2034", "tentieumuc": "Thu từ dầu hỏa nhập khẩu (trừ dầu hỏa nhập khẩu để bán trong nước)"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2035", "tentieumuc": "Thu từ dầu mazut, dầu mỡ nhờn nhập khẩu (trừ dầu mazut, dầu mỡ nhờn nhập khẩu để bán trong nước)"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2036", "tentieumuc": "Thu từ than đá nhập khẩu"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2037", "tentieumuc": "Thu từ dung dịch hydro, chloro, fluoro, carbon nhập khẩu"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2038", "tentieumuc": "Thu từ túi ni long nhập khẩu"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2039", "tentieumuc": "Thu từ thuốc diệc cỏ nhập khẩu"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2041", "tentieumuc": "Thu từ xăng nhập khẩu đế bán trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2042", "tentieumuc": "Thu từ nhiên liệu bay nhập khẩu để bán trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2043", "tentieumuc": "Thu từ dầu diezel nhập khẩu để bán trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2044", "tentieumuc": "Thu từ dầu hỏa nhập khẩu để bán trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2045", "tentieumuc": "Thu từ dầu mazut, dầu mỡ nhờn nhập khẩu để bán trong nước"},
{"muc": "2000", "tenmuc": "Thuế bảo vệ môi trường", "tieumuc": "2049", "tentieumuc": "Thu từ các sản phẩm, hàng hóa nhập khẩu khác"},
{"muc": "2100", "tenmuc": "Phí trong lĩnh vực khác", "tieumuc": "2106", "tentieumuc": "Phí thẩm định tiêu chuân, điêu kiện hành nghê theo quy định của pháp luật"},
{"muc": "2100", "tenmuc": "Phí trong lĩnh vực khác", "tieumuc": "2107", "tentieumuc": "Phí tuyển dụng, dự thi nâng ngạch, thăng hạng công chức, viên chức"},
{"muc": "2100", "tenmuc": "Phí trong lĩnh vực khác", "tieumuc": "2108", "tentieumuc": "Phí thẩm định câp giây chứng nhận lưu hành sản phâm, hàng hóa theo quy định của pháp luật"},
{"muc": "2100", "tenmuc": "Phí trong lĩnh vực khác", "tieumuc": "2111", "tentieumuc": "Phí xác minh giây tờ, tài liệu"},
{"muc": "2100", "tenmuc": "Phí trong lĩnh vực khác", "tieumuc": "2146", "tentieumuc": "Thu nợ phí xăng dầu"},
{"muc": "2100", "tenmuc": "Phí trong lĩnh vực khác", "tieumuc": "2147", "tentieumuc": "Thu nợ phí thuộc lĩnh vực công nghiệp, xây dựng"},
{"muc": "2100", "tenmuc": "Phí trong lĩnh vực khác", "tieumuc": "2148", "tentieumuc": "Thu nợ  phí thuộc lĩnh vực giáo dục và đào tạo."},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2151", "tentieumuc": "Phí kiểm dịch động vật, sản phẩm động vật và thực vật"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2152", "tentieumuc": "Phí giám sát khử trùng vật thể thuộc diện kiểm dịch thực vật"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2153", "tentieumuc": "Phí kiểm soát giết mổ động vật"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2154", "tentieumuc": "Phí kiểm nghiệm dư lượng thuốc bảo vệ thực vật và sản phẩm thực vật"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2155", "tentieumuc": "Phí kiểm nghiệm chất lượng thức ăn chăn nuôi"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2156", "tentieumuc": "Phí kiểm tra vệ sinh thú y"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2157", "tentieumuc": "Phí bảo vệ nguồn lợi thủy sản"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2158", "tentieumuc": "Phí kiểm nghiệm thuốc thú y"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2161", "tentieumuc": "Phí kiểm định, khảo nghiệm thuốc bảo vệ thực vật"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2162", "tentieumuc": "Phí bình tuyển công nhận cây mẹ, cây đầu dòng, vườn giống cây lâm nghiệp, rừng giống"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2163", "tentieumuc": "Phí phòng, chống dịch bệnh cho động vật"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2164", "tentieumuc": "Phí bảo hộ giống trong lĩnh vực nông nghiệp, lâm nghiệp, thủy sản"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2165", "tentieumuc": "Phí kiểm nghiệm an toàn thực phẩm nông nghiệp, lâm nghiệp, thủy sản nhập khẩu"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2166", "tentieumuc": "Phí thẩm định trong lĩnh vực nông nghiệp"},
{"muc": "2150", "tenmuc": "Phí thuộc lĩnh vực nông nghiệp, lâm nghiệp, thủy sản", "tieumuc": "2167", "tentieumuc": "Phí đăng kiểm an toàn kỹ thuật tàu cá, kiểm định trang thiết bị nghề cá"},
{"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực ngoại giao", "tieumuc": "2206", "tentieumuc": "Phí xác nhận đăng ký công dân"},
{"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực ngoại giao", "tieumuc": "2207", "tentieumuc": "Phí cấp thị thực và các giấy tờ có liên quan đến xuất nhập cảnh Việt Nam cho người nước ngoài"},
{"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực ngoại giao", "tieumuc": "2208", "tentieumuc": "Phí tiếp nhận và vận chuyển đơn, chứng cứ của công dân và pháp nhân Việt Nam"},
{"muc": "2200", "tenmuc": "Phí thuộc lĩnh vực ngoại giao", "tieumuc": "2211", "tentieumuc": "Phí chứng nhận lãnh sự và hợp pháp hóa lãnh sự"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2251", "tentieumuc": "Phí chứng nhận xuất xứ hàng hoá (C/O)"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2252", "tentieumuc": "Phí chợ"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2253", "tentieumuc": "Phí thẩm định kinh doanh thương mại có điều kiện thuộc các lĩnh vực, các ngành nghề"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2254", "tentieumuc": "Phí thẩm định hồ sơ mua bán tàu, thuyền, tàu bay"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2255", "tentieumuc": "Phí thẩm định dự án đầu tư xây dựng (gồm: thẩm định phần thuyết minh và thiết kế  cơ  sở); thẩm định thiết kế  kỹ  thuật và các đồ  án qui hoạch"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2256", "tentieumuc": "Phí thẩm định đánh giá trữ lượng khoáng sản"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2257", "tentieumuc": "Phí thẩm định, phân hạng cơ sở lưu trú du lịch"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2258", "tentieumuc": "Phí đấu thầu, đấu giá và thẩm định kết quả đấu thầu"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2261", "tentieumuc": "Phí giám định hàng hoá xuất nhập khẩu"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2262", "tentieumuc": "Phí xử lý vụ việc cạnh tranh"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2263", "tentieumuc": "Phí thẩm định cấp phép sử dụng vật liệu nổ công nghiệp"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2264", "tentieumuc": "Phí trong lĩnh vực hóa chất"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2265", "tentieumuc": "Phí thẩm định điều kiện, tiêu chuẩn ngành nghề thuộc lĩnh vực công nghiệp, thương mại, xây dựng"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2266", "tentieumuc": "Phí cung cấp thông tin doanh nghiệp"},
{"muc": "2250", "tenmuc": "Phí thuộc lĩnh vực thương mại, đầu tư", "tieumuc": "2267", "tentieumuc": "Phí sử dụng công trình kết cấu hạ tầng, công trình dịch vụ, tiện ích công cộng trong khu vực cửa khẩu"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2301", "tentieumuc": "Phí sử dụng đường bộ"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2302", "tentieumuc": "Phí sử dụng đường thủy nội địa (phí bảo đảm hàng giang)"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2303", "tentieumuc": "Phí sử dụng đường biển"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2304", "tentieumuc": "Phí qua cầu"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2305", "tentieumuc": "Phí qua đò"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2306", "tentieumuc": "Phí qua phà"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2307", "tentieumuc": "Phí sử dụng cầu, bến, phao neo thuộc khu vực cảng biển"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2308", "tentieumuc": "Phí sử dụng cầu, bến, phao neo thuộc cảng, bến thủy nội địa"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2311", "tentieumuc": "Phí sử dụng cảng cá"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2312", "tentieumuc": "Phí sử dụng vị trí neo, đậu ngoài phạm vi cảng"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2313", "tentieumuc": "Phí bảo đảm hàng hải"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2314", "tentieumuc": "Phí hoa tiêu, dẫn đường trong lĩnh vực đường biển"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2315", "tentieumuc": "Phí hoa tiêu, dẫn đường trong lĩnh vực đường thủy nội địa"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2316", "tentieumuc": "Phí hoa tiêu, dẫn đường trong lĩnh vực hàng không"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2317", "tentieumuc": "Phí trọng tải tàu, thuyền"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2318", "tentieumuc": "Phí luồng, lạch đường thủy nội địa"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2321", "tentieumuc": "Phí sử dụng lề đường, bến, bãi, mặt nước, các công trình kết cấu hạ tầng, công trình dịch vụ và tiện ích công cộng khác trong khu kinh tế cửa khẩu"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2322", "tentieumuc": "Phí kiểm định an toàn kỹ thuật và chất lượng thiết bị, vật tư, phương tiện giao thông vận tải, phương tiện đánh bắt thủy sản"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2323", "tentieumuc": "Phí sử dụng kết cấu hạ tầng đường sắt quốc gia"},
{"muc": "2300", "tenmuc": "Phí thuộc lĩnh vực giao thông vận tải", "tieumuc": "2324", "tentieumuc": "Phí lưu giữ, bảo quản tang vật, phương tiện"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2351", "tentieumuc": "Phí sử dụng, bảo vệ tần số vô tuyến điện"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2352", "tentieumuc": "Phí cấp tên miền, địa chỉ Internet"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2353", "tentieumuc": "Phí sử dụng kho số viễn thông"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2354", "tentieumuc": "Phí khai thác và sử dụng tài liệu dầu khí"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2355", "tentieumuc": "Phí khai thác và sử dụng tài liệu đất đai, thăm dò điều tra địa chất và khai thác mỏ, tài nguyên khoáng sản khác."},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2356", "tentieumuc": "Phí khai thác và sử  dụng tài liệu khí tượng thủy văn, môi trường nước và không khí"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2357", "tentieumuc": "Phí khai thác, sử dụng tư liệu tại thư viện, bảo tàng, khu di tích lịch sử, văn hoá và tài liệu lưu trữ"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2358", "tentieumuc": "Phí thẩm định điều kiện hoạt động bưu chính, viễn thông"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2361", "tentieumuc": "Phí quyền hoạt động viễn thông"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2362", "tentieumuc": "Phí thẩm định điều kiện hoạt động viễn thông"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2363", "tentieumuc": "Phí thẩm định điều kiện hoạt động bưu chính"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2364", "tentieumuc": "Phí dịch vụ duy trì hệ thống kiểm tra trạng thái chứng thư số"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2365", "tentieumuc": "Phí quyền cung cấp dịch vụ truyền hình trả tiền"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2366", "tentieumuc": "Phí thẩm định nội dung, kịch bản trò chơi điện tử trên mạng"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2367", "tentieumuc": "Phí thẩm định và chứng nhận hợp chuẩn, hợp quy về an toàn thông tin"},
{"muc": "2350", "tenmuc": "Phí thuộc lĩnh vực thông tin, liên lạc", "tieumuc": "2368", "tentieumuc": "Phí thẩm định cấp giấy phép kinh doanh sản phẩm, dịch vụ an toàn thông tin mạng"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2401", "tentieumuc": "Phí kiểm định kỹ thuật máy móc, thiết bị, vật tư và các chất có yêu cầu nghiêm ngặt về an toàn lao động"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2402", "tentieumuc": "Phí kiểm định kỹ thuật máy móc, thiết bị, vật tư và các chất có yêu cầu nghiêm ngặt về an toàn đặc thù chuyên ngành công nghiệp"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2403", "tentieumuc": "Phí an ninh, trật tự"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2404", "tentieumuc": "Phí phòng cháy, chữa cháy"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2405", "tentieumuc": "Phí thẩm định cấp phép sử dụng vật liệu nổ công nghiệp"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2406", "tentieumuc": "Phí kiểm tra, đánh giá, cấp giấy chứng nhận quốc tế về an ninh tàu biển"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2407", "tentieumuc": "Phí thẩm định, phê duyệt đánh giá an ninh cảng biển, cấp sổ lý lịch tàu biển"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2408", "tentieumuc": "Phí thẩm định cấp phép hoạt động cai nghiện ma tuý"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2411", "tentieumuc": "Phí thẩm định cấp phép hoạt động hoá chất nguy hiểm, thẩm định báo cáo đánh giá rủi ro hoá chất mới sản xuất, sử dụng ở Việt Nam, đánh giá điều kiện hoạt động theo quy định của pháp luật"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2412", "tentieumuc": "Phí xác minh giấy tờ, tài liệu theo yêu cầu của tổ  chức, cá nhân trong nước"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2413", "tentieumuc": "Phí xác minh giấy tờ, tài liệu theo yêu cầu của tổ  chức, cá nhân nước ngoài"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2414", "tentieumuc": "Phí xử lý hồ sơ cấp Giấy chứng nhận miễn thị thực"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2415", "tentieumuc": "Phí thẩm định điều kiện về an ninh trật tự"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2416", "tentieumuc": "Phí sát hạch cấp chứng chỉ nghiệp vụ bảo vệ"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2417", "tentieumuc": "Phí trông giữ xe đạp, xe máy, ôtô và phí trông giữ phương tiện tham gia giao thông bị tạm giữ do vi phạm pháp luật"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2418", "tentieumuc": "Phí thẩm định điêu kiện, tiêu chuân hành nghê thuộc lĩnh vực an ninh, quốc phòng"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2421", "tentieumuc": "Phí khai thác và sử dụng thông tin trong cơ sở dữ liệu quốc gia vê dân cư"},
{"muc": "2400", "tenmuc": "Phí thuộc lĩnh vực an ninh, trật tự, an toàn xã hội", "tieumuc": "2422", "tentieumuc": "Phí thẩm định câp giây phép sản xuât, kinh doanh sản phâm mật mã dân sự; giây chứng nhận hợp chuân sản phâm mật mã dân sự; giây chứng nhận hợp quy sản phâm mật mã dân sự"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2451", "tentieumuc": "Phí giám định di vật, cổ vật, bảo vật quốc gia"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2452", "tentieumuc": "Phí tham quan danh lam thắng cảnh, di tích lịch sử, công trình văn hoá"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2453", "tentieumuc": "Phí thẩm định nội dung văn hoá phẩm xuất khẩu, nhập khẩu; kịch bản  phim  và  phim;  chương  trình  nghệ  thuật  biểu  diễn;  nội  dung xuất bản phẩm; chương trình trên băng, đĩa, phần mềm và trên các vật liệu khác"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2454", "tentieumuc": "Phí giới thiệu việc làm"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2455", "tentieumuc": "Phí thẩm định tiêu chuân, điêu kiện hành nghê thuộc lĩnh vực văn hóa, thể thao, du lịch"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2456", "tentieumuc": "Phí thư viện"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2457", "tentieumuc": "Phí bảo quản ký gửi và sử dụng tài liệu lưu trữ"},
{"muc": "2450", "tenmuc": "Phí thuộc lĩnh vực văn hoá, xã hội", "tieumuc": "2458", "tentieumuc": "Phí đăng ký quyên tác giả, quyên liên quan đên quyên tác giả"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2504", "tentieumuc": "Phí sở hữu trí tuệ"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2505", "tentieumuc": "Phí câp mã số, mã vạch"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2506", "tentieumuc": "Phí sử dụng dịch vụ trong lĩnh vực năng lượng nguyên tử"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2507", "tentieumuc": "Phí thẩm định an toàn phóng xạ, bức xạ, an ninh hạt nhân"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2508", "tentieumuc": "Phí thẩm định kê hoạch ứng phó sự cố bức xạ, hạt nhân"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2511", "tentieumuc": "Phí thẩm định điêu kiện câp giây phép đăng ký dịch vụ hỗ trợ ứng dụng năng lượng nguyên tử"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2512", "tentieumuc": "Phí thẩm định hợp đồng chuyển giao công nghệ"},
{"muc": "2500", "tenmuc": "Phí thuộc lĩnh vực Khoa học và công nghệ", "tieumuc": "2513", "tentieumuc": "Phí thẩm định điêu kiện hoạt động vê khoa học, công nghệ"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2551", "tentieumuc": "Viện phí và các loại phí khám chữa bệnh"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2552", "tentieumuc": "Phí phòng, chống dịch bệnh cho động vật; chẩn đoán thú y"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2553", "tentieumuc": "Phí y tế dự phòng"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2554", "tentieumuc": "Phí giám định y khoa"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2555", "tentieumuc": "Phí kiểm nghiệm mẫu thuốc, nguyên liệu làm thuốc, thuốc, mỹ phẩm"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2556", "tentieumuc": "Phí kiểm dịch y tế"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2557", "tentieumuc": "Phí kiểm nghiệm trang thiết bị y tế"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2558", "tentieumuc": "Phí kiểm tra, kiểm nghiệm vệ sinh an toàn thực phẩm"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2561", "tentieumuc": "Phí thẩm định tiêu chuẩn và điều kiện hành nghề y"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2562", "tentieumuc": "Phí thẩm định đăng ký kinh doanh thuốc"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2563", "tentieumuc": "Phí thẩm định hồ sơ nhập khẩu thuốc thành phẩm chưa có số đăng ký"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2564", "tentieumuc": "Phí cấp, đổi thẻ bảo hiểm y tế"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2565", "tentieumuc": "Phí thẩm định câp giây giám định y khoa"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2566", "tentieumuc": "Phí thẩm định câp giây phép lưu hành, nhập khâu, xuât khâu, công bố trang thiêt bị y tê"},
{"muc": "2550", "tenmuc": "Phí thuộc lĩnh vực y tế", "tieumuc": "2567", "tentieumuc": "Phí thẩm định câp phép lưu hành, nhập khâu, xác nhận, công bố"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2602", "tentieumuc": "Phí thẩm định báo cáo đánh giá tác động môi trường"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2603", "tentieumuc": "Phí vệ sinh"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2604", "tentieumuc": "Phí phòng, chống thiên tai"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2605", "tentieumuc": "Phí xét nghiệm, thẩm định, giám định; tra cứu, cung cấp thông tin; cấp các loại bản sao, phó bản, bản cấp lại các tài liệu sở hữu công nghiệp"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2606", "tentieumuc": "Phí lập và gửi đơn đăng ký quốc tế về sở hữu công nghiệp"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2607", "tentieumuc": "Phí cung cấp dịch vụ để giải quyết khiếu nại về sở hữu công nghiệp"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2608", "tentieumuc": "Phí thẩm định, cung cấp thông tin, dịch vụ về văn bằng bảo hộ giống cây trồng mới"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2611", "tentieumuc": "Phí cấp, hướng dẫn và duy trì sử dụng mã số, mã vạch"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2612", "tentieumuc": "Phí thẩm định an toàn và sử dụng dịch vụ an toàn bức xạ"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2613", "tentieumuc": "Phí thẩm định điều kiện hoạt động về khoa học công nghệ, môi trường"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2614", "tentieumuc": "Phí thẩm định đề án, báo cáo thăm dò, khai thác, sử dụng và đánh giá trữ lượng nước dưới đất; khai thác, sử dụng nước mặt; xả nước thải vào nguồn nước, công trình thuỷ lợi"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2615", "tentieumuc": "Phí thẩm định hồ sơ, điều kiện hành nghề khoan nước dưới đất"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2616", "tentieumuc": "Phí thẩm định hợp đồng chuyển giao công nghệ"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2617", "tentieumuc": "Phí kiểm định phương tiện đo lường"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2618", "tentieumuc": "Phí bảo vệ môi trường đối với nước thải sinh hoạt"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2621", "tentieumuc": "Phí bảo vệ môi trường đối với nước thải công nghiệp"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2622", "tentieumuc": "Phí bảo vệ môi trường đối với khí thải"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2623", "tentieumuc": "Phí bảo vệ môi trường đối với chất thải rắn"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2624", "tentieumuc": "Phí bảo vệ môi trường đối với khai thác khoáng sản là dầu thô và khí thiên nhiên"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2625", "tentieumuc": "Phí bảo vệ môi trường dối với khai thác khoáng sản còn lại"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2626", "tentieumuc": "Phí thẩm định câp giây chứng nhận lưu hành tự do (CFS) sản phâm, hàng hóa đo đạc và bản đồ khi xuât khâu, nhập khâu"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2627", "tentieumuc": "Phí thẩm định hồ sơ cấp giấy chứng nhận quyền sử dụng đất"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2628", "tentieumuc": "Phí thẩm định đánh giá trữ lượng khoáng sản"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2631", "tentieumuc": "Phí khai thác, sử dụng nguồn nước"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2632", "tentieumuc": "Phí thẩm định điều kiện hành nghề thuộc lĩnh vực tài nguyên môi trường"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2633", "tentieumuc": "Phí khai thác, sử dụng tài liệu, dữ liệu tài nguyên và môi trường"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2634", "tentieumuc": "Phí thẩm định báo cáo đánh giá tác động môi trường, đề án bảo vệ môi trường chi tiết; thẩm định phương án cải tạo, phục hồi môi trường và phương án cải tạo, phục hồi môi trường bổ sung"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2635", "tentieumuc": "Phí thẩm định kế hoạch bảo vệ môi trường trong hoạt động phá dỡ tàu biển, xác nhận đủ điều kiện về bảo vệ môi trường trong nhập khẩu phế liệu làm nguyên liệu sản xuất"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2636", "tentieumuc": "Phí khai thác, sử dụng thông tin dữ liệu đo đạc và bản đồ"},
{"muc": "2600", "tenmuc": "Phí thuộc lĩnh vực khoa học, công nghệ và môi trường", "tieumuc": "2637", "tentieumuc": "Phí khai thác và sử dụng tài liệu dầu khí"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2651", "tentieumuc": "Phí cung cấp thông tin về tài chính doanh nghiệp"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2652", "tentieumuc": "Phí phát hành, thanh toán tín phiếu kho bạc"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2653", "tentieumuc": "Phí phát hành, thanh toán trái phiếu kho bạc"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2654", "tentieumuc": "Phí tổ chức phát hành, thanh toán trái phiếu đầu tư huy động vốn cho công trình do ngân sách nhà nước đảm bảo"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2655", "tentieumuc": "Phí phát hành, thanh toán trái phiếu đầu tư  để  huy động vốn cho Ngân hàng Phát triển Việt Nam theo kế hoạch tín dụng đầu tư phát triển của Nhà  nước, trái phiếu Chính phủ, trái phiếu được Chính phủ bảo lãnh, trái phiếu chính quyền địa phương và cổ phiếu, trái phiếu doanh nghiệp"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2656", "tentieumuc": "Phí bảo quản, cất giữ các loại tài sản quý hiếm và chứng chỉ có giá tại Kho bạc Nhà nước"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2657", "tentieumuc": "Phí cấp bảo lãnh của Chính phủ (do Bộ Tài chính hoặc Ngân hàng Nhà nước Việt Nam cấp)"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2658", "tentieumuc": "Phí quản lý cho vay của Ngân hàng Phát triển Việt Nam"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2661", "tentieumuc": "Phí sử dụng thiết bị, cơ sở hạ tầng chứng khoán"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2662", "tentieumuc": "Phí hoạt động chứng khoán"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2663", "tentieumuc": "Phí niêm phong, kẹp chì, lưu kho hải quan"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2664", "tentieumuc": "Phí quản lý, giám sát hoạt động chứng khoán, bảo hiểm, kế toán, kiểm toán"},
{"muc": "2650", "tenmuc": "Phí thuộc lĩnh vực tài chính, ngân hàng, hải quan", "tieumuc": "2665", "tentieumuc": "Phí thẩm định tiêu chuẩn, điều kiện hành nghề thuộc lĩnh vực tài chính"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2701", "tentieumuc": "Án phí (hình sự, dân sự, kinh tế, lao động, hành chính)"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2702", "tentieumuc": "Phí giám định tư pháp"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2703", "tentieumuc": "Phí cung cấp thông tin về cầm cố, thế chấp, bảo lãnh tài sản đăng ký giao dịch bảo đảm"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2704", "tentieumuc": "Phí cung cấp thông tin về tài sản cho thuê tài chính"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2705", "tentieumuc": "Phí cấp bản sao, bản trích lục bản án, quyết định và giấy chứng nhận xoá án"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2706", "tentieumuc": "Phí thi hành án"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2707", "tentieumuc": "Phí tống đạt, uỷ  thác tư pháp theo yêu cầu của cơ  quan có thẩm quyền của nước ngoài"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2708", "tentieumuc": "Phí xuất khẩu lao động"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2711", "tentieumuc": "Phí phá sản"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2712", "tentieumuc": "Phí thẩm định hồ sơ đề nghị hưởng miễn trừ đối với thoả thuận hạn chế cạnh tranh bị cấm, miễn trừ đối với tập trung kinh tế bị cấm theo pháp luật về cạnh tranh"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2713", "tentieumuc": "Phí giải quyết việc nuôi con nuôi đối với người nước ngoài"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2714", "tentieumuc": "Phí xử lý vụ việc cạnh tranh"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2715", "tentieumuc": "Phí công chứng"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2716", "tentieumuc": "Phí chứng thực"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2717", "tentieumuc": "Phí thẩm định điều kiện hoạt động thuộc lĩnh vực tư pháp"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2718", "tentieumuc": "Phí đăng ký giao dịch bảo đảm"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2721", "tentieumuc": "Phí sử dụng thông tin"},
{"muc": "2700", "tenmuc": "Phí thuộc lĩnh vực tư pháp", "tieumuc": "2722", "tentieumuc": "Phí cấp mã số sử dụng cơ sở dữ liệu về giao dịch bảo đảm"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2751", "tentieumuc": "Lệ phí quốc tịch, hộ tịch, hộ khẩu, chứng minh nhân dân"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2752", "tentieumuc": "Lệ phí cấp hộ chiếu, thị thực xuất cảnh, nhập cảnh"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2753", "tentieumuc": "Lệ phí qua lại cửa khẩu biên giới"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2754", "tentieumuc": "Lệ  phí áp dụng tại cơ  quan đại diện ngoại giao, cơ  quan lãnh sự Việt Nam ở nước ngoài"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2755", "tentieumuc": "Lệ phí nộp đơn yêu cầu Toà án Việt Nam công nhận và cho thi hành tại Việt Nam bản án, quyết định dân sự của Toà án nước ngoài"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2756", "tentieumuc": "Lệ phí nộp đơn yêu cầu Toà án Việt Nam không công nhận bản án, quyết định dân sự của Toà án nước ngoài không có yêu cầu thi hành tại Việt Nam"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2757", "tentieumuc": "Lệ phí nộp đơn yêu cầu Toà án Việt Nam công nhận và cho thi hành tại Việt Nam quyết định của Trọng tài nước ngoài"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2758", "tentieumuc": "Lệ phí nộp đơn yêu cầu Toà án kết luận cuộc đình công hợp pháp hoặc bất hợp pháp"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2761", "tentieumuc": "Lệ phí kháng cáo"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2762", "tentieumuc": "Lệ phí toà án liên quan đến trọng tài"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2763", "tentieumuc": "Lệ phí cấp giấy phép lao động cho người nước ngoài làm việc tại Việt Nam"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2764", "tentieumuc": "Lệ phí cấp phiếu lý lịch tư pháp"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2765", "tentieumuc": "Lệ phí cấp thẻ đi lại của doanh nhân APEC"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2766", "tentieumuc": "Lệ phí tòa án"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2767", "tentieumuc": "Lệ phí đăng ký cư trú"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2768", "tentieumuc": "Lệ phí cấp chứng minh nhân dân, căn cước công dân"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2771", "tentieumuc": "Lệ phí hộ tịch"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2772", "tentieumuc": "Lệ phí cấp phép hoạt động đưa người lao động đi làm việc có thời hạn ở nước ngoài"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2773", "tentieumuc": "Lệ phí đăng ký nuôi con nuôi"},
{"muc": "2750", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền và nghĩa vụ của công dân", "tieumuc": "2774", "tentieumuc": "Lệ phí câp phép các tổ chức nuôi con nuôi"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2801", "tentieumuc": "Lệ phí trước bạ nhà đất"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2802", "tentieumuc": "Lệ phí trước bạ ô tô"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2803", "tentieumuc": "Lệ phí trước bạ tàu thuyền"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2804", "tentieumuc": "Lệ phí trước bạ tài sản khác"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2805", "tentieumuc": "Lệ phí địa chính"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2806", "tentieumuc": "Lệ phí đăng ký giao dịch bảo đảm"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2807", "tentieumuc": "Lệ phí cấp giấy chứng nhận quyền tác giả"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2808", "tentieumuc": "Lệ phí nộp đơn và cấp văn bằng bảo hộ, đăng ký hợp đồng chuyển giao quyền sở hữu công nghiệp"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2811", "tentieumuc": "Lệ phí duy trì, gia hạn, chấm dứt, khôi phục hiệu lực văn bằng bảo hộ"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2812", "tentieumuc": "Lệ phí đăng bạ, công bố thông tin sở hữu công nghiệp"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2813", "tentieumuc": "Lệ  phí cấp chứng chỉ  hành nghề, đăng bạ  đại diện sở  hữu công nghiệp"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2814", "tentieumuc": "Lệ phí đăng ký, cấp, công bố, duy trì hiệu lực văn bằng bảo hộ giống cây trồng mới"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2815", "tentieumuc": "Lệ phí cấp giấy phép xây dựng"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2816", "tentieumuc": "Lệ phí đăng ký, cấp biển phương tiện giao thông (không kể phương tiện giao thông đường thuỷ)"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2817", "tentieumuc": "Lệ phí đăng ký, cấp biển phương tiện giao thông đường thuỷ"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2818", "tentieumuc": "Lệ phí đăng ký, cấp biển xe máy chuyên dùng"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2821", "tentieumuc": "Lệ phí cấp chứng chỉ cho tàu bay"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2822", "tentieumuc": "Lệ phí cấp biển số nhà"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2823", "tentieumuc": "Lệ  phí cấp giấy chứng nhận quyền sở  hữu nhà ở, quyền sở  hữu công trình xây dựng"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2824", "tentieumuc": "Lệ phí trước bạ xe máy"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2825", "tentieumuc": "Lệ phí trước bạ tàu bay"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2826", "tentieumuc": "Lệ phí câp giây phép quy hoạch"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2827", "tentieumuc": "Lệ phí quản lý phương tiện giao thông"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2828", "tentieumuc": "Lệ phí trong lĩnh vực hàng hải"},
{"muc": "2800", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến quyền sở hữu, quyền sử dụng tài sản", "tieumuc": "2831", "tentieumuc": "Lệ phí sở hữu trí tuệ"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2851", "tentieumuc": "Lệ  phí cấp giấy chứng nhận đăng ký kinh doanh, cung cấp thông tin về đăng ký kinh doanh, đối với các loại hình tổ chức kinh tế, các hộ kinh doanh"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2852", "tentieumuc": "Lệ phí đăng ký khai báo hoá chất nguy hiểm, hoá chất độc hại, máy, thiết bị có yêu cầu an toàn đặc thù chuyên ngành công nghiệp"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2853", "tentieumuc": "Lệ phí về cấp chứng nhận, cấp chứng chỉ, cấp giấy phép, cấp thẻ, đăng ký, kiểm tra đối với các hoạt động, các ngành nghề kinh doanh theo quy định của pháp luật"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2854", "tentieumuc": "Lệ phí đặt chi nhánh, văn phòng đại diện của các tổ chức kinh tế nước ngoài tại Việt Nam"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2855", "tentieumuc": "Lệ phí cấp hạn ngạch xuất khẩu, nhập khẩu"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2856", "tentieumuc": "Lệ phí cấp và dán tem kiểm soát băng, đĩa có chương trình"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2857", "tentieumuc": "Lệ phí độc quyền hoạt động trong ngành dầu khí"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2858", "tentieumuc": "Lệ phí độc quyền hoạt động trong một số ngành, nghề tài nguyên khoáng sản khác theo quy định của pháp luật"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2861", "tentieumuc": "Lệ phí đăng ký doanh nghiệp"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2862", "tentieumuc": "Lệ phí môn bài mức (bậc) 1"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2863", "tentieumuc": "Lệ phí môn bài mức (bậc) 2"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2864", "tentieumuc": "Lệ phí môn bài mức (bậc) 3"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2865", "tentieumuc": "Lệ phí phân bổ kho số viễn thông, tài nguyên Internet"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2866", "tentieumuc": "Lệ phí câp và dán tem kiêm soát băng, đĩa có chương trình"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2867", "tentieumuc": "Lệ phí chuyên nhượng chứng chỉ, tín chỉ giảm phát thải khí nhà kính"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2868", "tentieumuc": "Lệ phí câp tên định danh người gửi dùng trong hoạt động quảng cáo trên mạng"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2871", "tentieumuc": "Lệ phí trong lĩnh vực tiêu chuân, đo lường chât lượng"},
{"muc": "2850", "tenmuc": "Lệ phí quản lý nhà nước liên quan đến sản xuất, kinh doanh", "tieumuc": "2872", "tentieumuc": "Lệ phí đăng ký các quyên đối với tàu bay"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3001", "tentieumuc": "Lệ phí ra, vào cảng biển"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3002", "tentieumuc": "Lệ phí ra, vào cảng, bến thủy nội địa"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3003", "tentieumuc": "Lệ phí ra, vào cảng hàng không, sân bay"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3004", "tentieumuc": "Lệ phí cấp phép bay"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3005", "tentieumuc": "Lệ phí hàng hoá, hành lý, phương tiện vận tải quá cảnh"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3006", "tentieumuc": "Lệ  phí cấp phép hoạt động khảo sát, thiết kế, lắp đặt, sửa chữa, bảo dưỡng các công trình thông tin bưu điện, dầu khí, giao thông vận tải đi qua vùng đất, vùng biển của Việt Nam"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3007", "tentieumuc": "Lệ phí hoa hồng chữ ký"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3008", "tentieumuc": "Lệ phí hoa hồng sản xuất"},
{"muc": "3000", "tenmuc": "Lệ phí quản lý nhà nước đặc biệt về chủ quyền quốc gia", "tieumuc": "3009", "tentieumuc": "Lệ phí cấp giấy phép cho các đối tượng liên quan hoạt động tàu, thuyển nước ngoài"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3051", "tentieumuc": "Lệ phí cấp phép sử dụng con dấu"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3052", "tentieumuc": "Lệ phí làm thủ tục hải quan"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3053", "tentieumuc": "Lệ phí áp tải hải quan"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3054", "tentieumuc": "Lệ phí cấp giấy đăng ký nguồn phóng xạ, máy phát bức xạ"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3055", "tentieumuc": "Lệ phí cấp giấy đăng ký địa điểm cất giữ chất thải phóng xạ"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3056", "tentieumuc": "Lệ phí cấp văn bằng, chứng chỉ"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3057", "tentieumuc": "Lệ phí cấp bản sao, chứng thực theo yêu cầu hoặc theo quy định của pháp luật"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3058", "tentieumuc": "Lệ phí hợp pháp hoá và chứng nhận lãnh sự"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3061", "tentieumuc": "Lệ phí công chứng"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3062", "tentieumuc": "Lệ phí cấp giấy phép quản lý vũ khí, vật liệu nổ, công cụ hỗ trợ"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3063", "tentieumuc": "Lệ phí cấp giấy phép quy hoạch"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3064", "tentieumuc": "Lệ phí câp chứng chỉ hành nghê dịch vụ thú y; chế phâm sinh học, vi sinh vật, hóa chât, chât xử lý cải tạo môi trường trong nuôi trồng thủy sản, chăn nuôi"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3065", "tentieumuc": "Lệ phí câp chứng nhận kiêm dịch động vật, sản phâm động vật trên cạn; thủy sản nhập khâu, quá cảnh, tạm nhập tái xuât, chuyên cửa khâu"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3066", "tentieumuc": "Lệ phí câp chứng chỉ hành nghê luật sư"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3067", "tentieumuc": "Lệ phí câp thẻ công chứng viên"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3068", "tentieumuc": "Lệ phí câp chứng chỉ hành nghê quản tài viên"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3071", "tentieumuc": "Lệ phí câp giây chứng nhận thuyết minh viên"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3072", "tentieumuc": "Lệ phí công nhận chât lượng vật tư nông nghiệp được phép lưu hành tại Việt Nam"},
{"muc": "3050", "tenmuc": "Lệ phí quản lý nhà nước trong các lĩnh vực khác", "tieumuc": "3073", "tentieumuc": "Lệ phí cấp giấy phép xuất khẩu, nhập khẩu giống, nguồn gen cây trồng nông nghiệp"},
{"muc": "3200", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước", "tieumuc": "3201", "tentieumuc": "Lương thực"},
{"muc": "3200", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước", "tieumuc": "3202", "tentieumuc": "Nhiên liệu"},
{"muc": "3200", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước", "tieumuc": "3203", "tentieumuc": "Vật tư kỹ thuật"},
{"muc": "3200", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước", "tieumuc": "3204", "tentieumuc": "Trang thiết bị kỹ thuật"},
{"muc": "3200", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước", "tieumuc": "3249", "tentieumuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước - Khác"},
{"muc": "3250", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3251", "tentieumuc": "Lương thực"},
{"muc": "3250", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3252", "tentieumuc": "Nhiên liệu"},
{"muc": "3250", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3253", "tentieumuc": "Vật tư kỹ thuật"},
{"muc": "3250", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3254", "tentieumuc": "Trang thiết bị kỹ thuật"},
{"muc": "3250", "tenmuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước chuyên ngành", "tieumuc": "3299", "tentieumuc": "Thu tiền bán hàng hoá, vật tư dự trữ nhà nước chuyên ngành - Khác"},
{"muc": "3300", "tenmuc": "Thu tiền bán nhà thuộc sở hữu nhà nước", "tieumuc": "3301", "tentieumuc": "Thu tiền bán nhà thuộc sở hữu nhà nước"},
{"muc": "3300", "tenmuc": "Thu tiền bán nhà thuộc sở hữu nhà nước", "tieumuc": "3302", "tentieumuc": "Thu tiền thanh lý nhà làm việc"},
{"muc": "3300", "tenmuc": "Thu tiền bán nhà thuộc sở hữu nhà nước", "tieumuc": "3349", "tentieumuc": "Thu tiền bán nhà thuộc sở hữu nhà nước - Khác"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3351", "tentieumuc": "Mô tô"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3352", "tentieumuc": "Ô tô con, ô tô tải"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3353", "tentieumuc": "Xe chuyên dùng"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3354", "tentieumuc": "Tàu, thuyền"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3355", "tentieumuc": "Đồ gỗ"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3356", "tentieumuc": "Trang thiết bị kỹ thuật chuyên dụng"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3357", "tentieumuc": "Máy tính, photo, máy fax"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3358", "tentieumuc": "Điều hoà nhiệt độ"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3361", "tentieumuc": "Thiết bị phòng, chữa cháy"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3362", "tentieumuc": "Thu bán cây đứng"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3363", "tentieumuc": "Thu tiền bán tài sản, vật tư thu hồi thuộc kết cấu hạ tầng đường sắt"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3364", "tentieumuc": "Thu từ bồi thường tài sản"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3365", "tentieumuc": "Thu tiền bán tài sản nhà nước trên đất và tiền sử dụng đất gắn với tài sản trên đất"},
{"muc": "3350", "tenmuc": "Thu từ tài sản khác", "tieumuc": "3399", "tentieumuc": "Các tài sản khác"},
{"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3401", "tentieumuc": "Quyền khai thác khoáng sản, tài nguyên"},
{"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3402", "tentieumuc": "Quyền đánh bắt hải sản"},
{"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3403", "tentieumuc": "Quyền hàng hải"},
{"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3404", "tentieumuc": "Quyền hàng không"},
{"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3405", "tentieumuc": "Bằng phát minh, sáng chế"},
{"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3406", "tentieumuc": "Bản quyền, nhãn hiệu thương mại"},
{"muc": "3400", "tenmuc": "Thu tiền bán tài sản vô hình", "tieumuc": "3449", "tentieumuc": "Thu tiền bán tài sản vô hình - Khác"},
{"muc": "3450", "tenmuc": "Thu từ bán tài sản được xác lập sở hữu nhà nước", "tieumuc": "3451", "tentieumuc": "Tài sản vô thừa nhận"},
{"muc": "3450", "tenmuc": "Thu từ bán tài sản được xác lập sở hữu nhà nước", "tieumuc": "3452", "tentieumuc": "Di sản, khảo cổ tìm thấy trong lòng đất"},
{"muc": "3450", "tenmuc": "Thu từ bán tài sản được xác lập sở hữu nhà nước", "tieumuc": "3453", "tentieumuc": "Tài sản không được quyền thừa kế"},
{"muc": "3450", "tenmuc": "Thu từ bán tài sản được xác lập sở hữu nhà nước", "tieumuc": "3499", "tentieumuc": "Thu từ bán tài sản được xác lập sở hữu nhà nước - Khác"},
{"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3601", "tentieumuc": "Thu tiền thuê mặt đất hằng năm"},
{"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3602", "tentieumuc": "Thu tiền thuê mặt nước hằng năm"},
{"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3603", "tentieumuc": "Thu tiền thuê mặt đất, mặt nước từ  các hoạt động thăm dò, khai thác dầu khí"},
{"muc": "3600", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3604", "tentieumuc": "Thu tiền cho thuê mặt đất, mặt nước trong khu công nghiệp, khu chế xuất"},
{"muc": "0", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3605", "tentieumuc": "Tiền thuê mặt đất thu một lần cho cả thời gian thuê"},
{"muc": "0", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3606", "tentieumuc": "Tiền thuê mặt nước thu một lần cho cả thời gian thuê"},
{"muc": "0", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3607", "tentieumuc": "Tiền thuê mặt biển thu hàng năm"},
{"muc": "0", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3608", "tentieumuc": "Tiền thuê mặt biển thu một lần cho cả thời gian thuê"},
{"muc": "0", "tenmuc": "Thu tiền cho thuê mặt đất, mặt nước", "tieumuc": "3649", "tentieumuc": "Thu tiền cho thuê mặt đất, mặt nước - Khác"},
{"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho doanh nghiệp và các tổ chức kinh tế", "tieumuc": "3651", "tentieumuc": "Thu nợ tiền sử dụng vốn ngân sách nhà nước"},
{"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho doanh nghiệp và các tổ chức kinh tế", "tieumuc": "3652", "tentieumuc": "Thu nợ tiền khấu hao cơ bản nhà thuộc sở hữu nhà nước"},
{"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho doanh nghiệp và các tổ chức kinh tế", "tieumuc": "3653", "tentieumuc": "Thu nợ tiền thu hồi vốn của các doanh nghiệp Nhà nước và các tổ chức kinh tế nhà nước"},
{"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho doanh nghiệp và các tổ chức kinh tế", "tieumuc": "3654", "tentieumuc": "Thu thanh lý tài sản cố  định của các doanh nghiệp Nhà nước và các tổ chức kinh tế nhà nước"},
{"muc": "3650", "tenmuc": "Thu từ tài sản Nhà nước giao cho doanh nghiệp và các tổ chức kinh tế", "tieumuc": "3699", "tentieumuc": "Thu từ tài sản Nhà nước giao cho doanh nghiệp và các tổ chức kinh tế - Khác"},
{"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu", "tieumuc": "3701", "tentieumuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu"},
{"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu", "tieumuc": "3702", "tentieumuc": "Phụ thu về giá lắp đặt điện thoại"},
{"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu", "tieumuc": "3703", "tentieumuc": "Phụ thu về giá bán điện"},
{"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu", "tieumuc": "3704", "tentieumuc": "Phụ thu về giá bán nước"},
{"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu", "tieumuc": "3705", "tentieumuc": "Phụ thu về giá bán mặt hàng nhựa PVC"},
{"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu", "tieumuc": "3706", "tentieumuc": "Phụ thu về dầu, khí"},
{"muc": "3700", "tenmuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu", "tieumuc": "3749", "tentieumuc": "Thu chênh lệch giá hàng xuất khẩu, nhập khẩu và các khoản phụ thu - Khác"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3751", "tentieumuc": "Thuế tài nguyên"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3752", "tentieumuc": "Thuế thu nhập doanh nghiệp"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3753", "tentieumuc": "Lợi nhuận sau thuế được chia của Chính phủ Việt Nam"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3754", "tentieumuc": "Dầu lãi được chia của Chính phủ Việt Nam"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3755", "tentieumuc": "Thuế đặt biệt"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3756", "tentieumuc": "Phụ thu về dầu"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3757", "tentieumuc": "Thu chênh lệch giá dầu"},
{"muc": "3750", "tenmuc": "Thu về dầu thô theo hiệp định, hợp đồng", "tieumuc": "3799", "tentieumuc": "Thu về dầu thô theo hiệp định, hợp đồng - Khác"},
{"muc": "3800", "tenmuc": "Thu về khí thiên nhiên của Chính phủ được phân chia theo hiệp định, hợp đồng thăm dò, khai thác dầu khí", "tieumuc": "3801", "tentieumuc": "Thuế tài nguyên"},
{"muc": "3800", "tenmuc": "Thu về khí thiên nhiên của Chính phủ được phân chia theo hiệp định, hợp đồng thăm dò, khai thác dầu khí", "tieumuc": "3802", "tentieumuc": "Thuế thu nhập doanh nghiệp"},
{"muc": "3800", "tenmuc": "Thu về khí thiên nhiên của Chính phủ được phân chia theo hiệp định, hợp đồng thăm dò, khai thác dầu khí", "tieumuc": "3803", "tentieumuc": "Khí lãi được chia của Chính phủ Việt Nam"},
{"muc": "3800", "tenmuc": "Thu về khí thiên nhiên của Chính phủ được phân chia theo hiệp định, hợp đồng thăm dò, khai thác dầu khí", "tieumuc": "3849", "tentieumuc": "Thu về khí thiên nhiên của Chính phủ được phân chia theo hiệp định, hợp đồng thăm dò, khai thác dầu khí - Khác"},
{"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3851", "tentieumuc": "Tiền thuê nhà ở thuộc sở hữu nhà nước"},
{"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3852", "tentieumuc": "Tiền thuê quầy bán hàng thuộc tài sản nhà nước"},
{"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3853", "tentieumuc": "Tiền thuê cơ sở hạ tầng đường sắt"},
{"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3854", "tentieumuc": "Tiền cho thuê và tiền chậm nộp tiền thuê cơ sở hạ tầng bến cảng, cầu cảng"},
{"muc": "3850", "tenmuc": "Thu tiền cho thuê tài sản nhà nước", "tieumuc": "3899", "tentieumuc": "Thu tiền cho thuê tài sản nhà nước - Khác"},
{"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3901", "tentieumuc": "Thu hoa lợi công sản từ quỹ đất công ích"},
{"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3902", "tentieumuc": "Thu hoa lợi công sản từ quỹ đất công"},
{"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3903", "tentieumuc": "Thu hỗ trợ khi nhà nước thu hồi đất theo chế độ quy định"},
{"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3804", "tentieumuc": "Lợi nhuận sau thuế được chia của Chính phủ Việt Nam"},
{"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3805", "tentieumuc": "Thuế đặc biệt"},
{"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3806", "tentieumuc": "Phụ thu về khí"},
{"muc": "3900", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3807", "tentieumuc": "Thu chênh lệch giá khí"},
{"muc": "0", "tenmuc": "Thu khác từ quỹ đất", "tieumuc": "3949", "tentieumuc": "Thu khác từ quỹ đất - Khác"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3951", "tentieumuc": "Thuế tài nguyên"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3952", "tentieumuc": "Thuế thu nhập doanh nghiệp"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3953", "tentieumuc": "Lãi được chia của Chính phủ Việt Nam"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3954", "tentieumuc": "Lợi nhuận sau thuế được chia của Chính phủ Việt Nam"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3955", "tentieumuc": "Thuế đặc biệt"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3956", "tentieumuc": "Phụ thu về condensate"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3957", "tentieumuc": "Thu chênh lệch giá condensate"},
{"muc": "3950", "tenmuc": "Thu về condensate theo hiệp định, hợp đồng", "tieumuc": "3999", "tentieumuc": "Thu về condensate theo hiệp định, hợp đồng - Khác"},
{"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư phát triển và tham gia góp vốn của Chính phủ ở trong nước", "tieumuc": "4051", "tentieumuc": "Lãi cho vay bằng nguồn vốn trong nước"},
{"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư phát triển và tham gia góp vốn của Chính phủ ở trong nước", "tieumuc": "4052", "tentieumuc": "Lãi cho vay bằng nguồn vốn ngoài nước"},
{"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư phát triển và tham gia góp vốn của Chính phủ ở trong nước", "tieumuc": "4053", "tentieumuc": "Chênh lệch thu, chi của Ngân hàng Nhà nước"},
{"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư phát triển và tham gia góp vốn của Chính phủ ở trong nước", "tieumuc": "4054", "tentieumuc": "Thu nhập từ vốn góp của Nhà nước"},
{"muc": "4050", "tenmuc": "Lãi thu từ các khoản cho vay đầu tư phát triển và tham gia góp vốn của Chính phủ ở trong nước", "tieumuc": "4099", "tentieumuc": "Lãi thu từ các khoản cho vay đầu tư phát triển và tham gia góp vốn của Chính phủ ở trong nước - Khác"},
{"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và tham gia góp vốn của Nhà nước ở nước ngoài", "tieumuc": "4101", "tentieumuc": "Lãi thu được từ các khoản cho các Chính phủ nước ngoài vay"},
{"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và tham gia góp vốn của Nhà nước ở nước ngoài", "tieumuc": "4102", "tentieumuc": "Lãi thu được từ các khoản cho các tổ chức quốc tế vay"},
{"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và tham gia góp vốn của Nhà nước ở nước ngoài", "tieumuc": "4103", "tentieumuc": "Lãi thu được từ các khoản cho các tổ chức tài chính và phi tài chính vay"},
{"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và tham gia góp vốn của Nhà nước ở nước ngoài", "tieumuc": "4104", "tentieumuc": "Lãi thu từ các khoản tham gia góp vốn của Nhà nước"},
{"muc": "4100", "tenmuc": "Lãi thu từ các khoản cho vay và tham gia góp vốn của Nhà nước ở nước ngoài", "tieumuc": "4149", "tentieumuc": "Lãi thu từ các khoản cho vay và tham gia góp vốn của Nhà nước ở nước ngoài - Khác"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4251", "tentieumuc": "Phạt vi phạm hành chính theo quyết định của Toàn án"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4252", "tentieumuc": "Phạt vi phạm giao thông"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4253", "tentieumuc": "Phạt vi phạm hành chính trong lĩnh vực Hải quan thuộc thẩm quyền ra quyết định của cơ quan Hải quan"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4254", "tentieumuc": "Phạt vi phạm hành chính trong lĩnh vực thuế Thuế thuộc thẩm quyền ra quyết định của cơ quan thuế (không gồm phạt vi phạm hành chính đối với Luật Thuế thu nhập cá nhân)"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4255", "tentieumuc": "Phạt về vi phạm chế độ kế toán - thống kê"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4256", "tentieumuc": "Phạt vi phạm tệ nạn xã hội"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4257", "tentieumuc": "Phạt vi phạm bảo vệ nguồn lợi thuỷ sản"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4258", "tentieumuc": "Phạt vi phạm về trồng và bảo vệ rừng"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4261", "tentieumuc": "Phạt vi phạm hành chính về bảo vệ môi trường"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4262", "tentieumuc": "Phạt vi phạm hành chính trong lĩnh vực y tế, văn hoá"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4263", "tentieumuc": "Phạt vi phạm hành chính về trật tự, an ninh, quốc phòng"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4264", "tentieumuc": "Phạt kinh doanh trái pháp luật do ngành Thuế thực hiện"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4265", "tentieumuc": "Phạt kinh doanh trái pháp luật do ngành Hải quan thực hiện"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4266", "tentieumuc": "Phạt kinh doanh trái pháp luật do ngành khác thực hiện"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4267", "tentieumuc": "Phạt vi phạm trật tự đô thị"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4268", "tentieumuc": "Phạt vi phạm hành chính đối với Luật Thuế thu nhập cá nhân"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4271", "tentieumuc": "Tiền phạt do phạm tội theo quyết định của tòa án"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4272", "tentieumuc": "Tiền chậm nộp phạt VPHC do cơ quan Thuế quản lý"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4273", "tentieumuc": "Tiền chậm nộp phạt VPHC do cơ quan Hải quan quản lý"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4274", "tentieumuc": "Phạt vi phạm hành chính trong lĩnh vực thuế do Ủy ban nhân dân ban hành quyết định phạt"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4275", "tentieumuc": "Phạt vi phạm hành chính trong lĩnh vực hải quan do Ủy ban nhân dân ban hành quyết định phạt"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4276", "tentieumuc": "Phạt vi phạm hành chính về an toàn vệ sinh thực phẩm"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4277", "tentieumuc": "Tiền nộp do chậm thi hành quyết định xử phạt vi phạm hành chính trong các lĩnh vực khác"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4278", "tentieumuc": "Phạt vi phạm hành chính trong các lĩnh vực khác"},
{"muc": "4250", "tenmuc": "Thu tiền phạt", "tieumuc": "4299", "tentieumuc": "Phạt vi phạm khác"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4301", "tentieumuc": "Tịch thu từ công tác chống lậu trong lĩnh vực thuế thuộc thẩm quyền ra quyết định tịch thu của cơ quan Thuế"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4302", "tentieumuc": "Tịch thu khác trong lĩnh vực thuế thuộc thẩm quyền ra quyết định tịch thu của cơ quan Thuế"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4303", "tentieumuc": "Tịch thu từ công tác chống lậu trong lĩnh vực hải quan thuộc thẩm quyền ra quyết định tịch thu của cơ quan Hải quan"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4304", "tentieumuc": "Tịch thu khác trong lĩnh vực hải quan thuộc thẩm quyền ra quyết định tịch thu của cơ quan Hải quan"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4305", "tentieumuc": "Tịch thu từ công tác chống lậu của cơ quan quản lý thị trường thực hiện"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4306", "tentieumuc": "Tịch thu theo quyết định của toà án, cơ quan thi hành án thực hiện"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4307", "tentieumuc": "Tịch thu từ công tác chống lậu do các ngành khác thực hiện"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4308", "tentieumuc": "Tịch thu từ công tác chống lậu do ngành Kiểm lâm thực hiện"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4311", "tentieumuc": "Tịch thu do phạm tội hoặc do liên quan tội phạm theo quyết định của tòa án, cơ quan thi hành án"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4312", "tentieumuc": "Tịch thu do vi phạm hành chính trong lĩnh vực thuế do UBND ban hành quyết định tịch thu"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4312", "tentieumuc": "Tịch thu do vi phạm hành chính trong lĩnh vực hải quan do UBND ban hành quyết định tịch thu"},
{"muc": "4300", "tenmuc": "Thu tịch thu", "tieumuc": "4349", "tentieumuc": "Thu tịch thu - Khác"},
{"muc": "4450", "tenmuc": "Các khoản huy động theo quyết định của Nhà nước", "tieumuc": "4451", "tentieumuc": "Xây dựng kết cấu hạ tầng"},
{"muc": "4450", "tenmuc": "Các khoản huy động theo quyết định của Nhà nước", "tieumuc": "4499", "tentieumuc": "Mục đích khác"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4501", "tentieumuc": "Xây dựng kết cấu hạ tầng tại địa phương"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4502", "tentieumuc": "Xây dựng nhà tình nghĩa"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4503", "tentieumuc": "Đóng góp để ủng hộ đồng bào bị thiên tai, bão lụt"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4504", "tentieumuc": "Đóng góp quỹ an ninh, quốc phòng"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4505", "tentieumuc": "Đóng góp quỹ phát triển ngành"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4506", "tentieumuc": "Đóng góp để ủng hộ nước ngoài"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4507", "tentieumuc": "Thu đóng góp quỹ hỗ trợ xuất khẩu của các doanh nghiệp kinh doanh xuất, nhập khẩu"},
{"muc": "4500", "tenmuc": "Các khoản đóng góp", "tieumuc": "4549", "tentieumuc": "Các khoản đóng góp - Khác"},
{"muc": "4650", "tenmuc": "Thu bổ sung từ ngân sách cấp trên", "tieumuc": "4651", "tentieumuc": "Bổ sung cân đối ngân sách"},
{"muc": "4650", "tenmuc": "Thu bổ sung từ ngân sách cấp trên", "tieumuc": "4652", "tentieumuc": "Bổ sung có mục tiêu bằng vốn vay nợ nước ngoài"},
{"muc": "4650", "tenmuc": "Thu bổ sung từ ngân sách cấp trên", "tieumuc": "4653", "tentieumuc": "Bổ sung có mục tiêu bằng vốn viện trợ không hoàn lại"},
{"muc": "4650", "tenmuc": "Thu bổ sung từ ngân sách cấp trên", "tieumuc": "4654", "tentieumuc": "Bổ sung các chương trình, mục tiêu quốc gia và dự án bằng nguồn vốn trong nước"},
{"muc": "4650", "tenmuc": "Thu bổ sung từ ngân sách cấp trên", "tieumuc": "4655", "tentieumuc": "Bổ sung có mục tiêu bằng vốn trong nước để thực hiện các nhiệm vụ phát triển kinh tế - xã hội và chính sách"},
{"muc": "4650", "tenmuc": "Thu bổ sung từ ngân sách cấp trên", "tieumuc": "4699", "tentieumuc": "Bổ sung khác"},
{"muc": "0", "tenmuc": "Thu ngân sách cấp dưới nộp cấp trên", "tieumuc": "4701", "tentieumuc": "Thu từ các khoản hoàn trả phát sinh trong năm"},
{"muc": "0", "tenmuc": "Thu ngân sách cấp dưới nộp cấp trên", "tieumuc": "4702", "tentieumuc": "Thu từ các khoản hoàn trả phát sinh năm trước"},
{"muc": "0", "tenmuc": "Thu ngân sách cấp dưới nộp cấp trên", "tieumuc": "4749", "tentieumuc": "Thu ngân sách cấp dưới nộp cấp trên - Khác"},
{"muc": "4750", "tenmuc": "Thu huy động Quỹ dự trữ tài chính", "tieumuc": "4751", "tentieumuc": "Thu huy động Quỹ dự trữ tài chính"},
{"muc": "4800", "tenmuc": "Thu kết dư ngân sách năm trước", "tieumuc": "4801", "tentieumuc": "Thu kết dư ngân sách năm trước"},
{"muc": "4850", "tenmuc": "Thu từ hỗ trợ của địa phương khác", "tieumuc": "4851", "tentieumuc": "Thu từ hỗ trợ của địa phương khác"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4901", "tentieumuc": "Thu chênh lệch tỷ giá ngoại tệ của ngân sách"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4902", "tentieumuc": "Thu hồi các khoản chi năm trước"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4904", "tentieumuc": "Các khoản thu khác của ngành Thuế"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4905", "tentieumuc": "Các khoản thu khác của ngành Hải quan"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4906", "tentieumuc": "Tiền lãi thu được từ các khoản vay nợ, viện trợ của các dự án"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4907", "tentieumuc": "Thu phụ trội trái phiếu"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4908", "tentieumuc": "Thu điểu tiết từ sản phẩm lọc hóa dầu"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4911", "tentieumuc": "Tiền chậm nộp do ngành thuế quản lý"},
{"muc": "4900", "tenmuc": "Các khoản thu khác", "tieumuc": "4912", "tentieumuc": "Tiền chậm nộp do ngành hải quan quản lý"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4913", "tentieumuc": "Thu từ các quỹ của Doanh nghiệp xổ số kiến thiết theo quy định"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4914", "tentieumuc": "Thu tiền bảo vệ, phát triển đất trồng lúa theo Nghị định số 35/2015/NĐ-CP của Chính phủ"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4917", "tentieumuc": "Tiền chậm nộp thuế thu nhập cá nhân"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4918", "tentieumuc": "Tiền chậm nộp thuế thu nhập doanh nghiệp (không bao gồm tiền chậm nộp thuế thu nhập doanh nghiệp từ hoạt động thăm dò, khai thác dầu khí)"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4919", "tentieumuc": "Tiền chậm nộp thuế thu nhập doanh nghiệp từ hoạt động thăm dò, khai thác dầu khí"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4921", "tentieumuc": "Tiền chậm nộp tiền cấp quyền khai thác khoáng sản đối với Giấy phép do cơ quan trung ương cấp phép"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4922", "tentieumuc": "Tiền chậm nộp tiền cấp quyền khai thác khoáng sản đối với Giấy phép do Ủy ban nhân dân tỉnh cấp phép"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4923", "tentieumuc": "Tiền chậm nộp tiền cấp quyền khai thác tài nguyên nước đối với giấy phép do cơ quan trung ương cấp phép"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4924", "tentieumuc": "Tiền chậm nộp tiền cấp quyền khai thác tài nguyên nước đối với giấy phép do cơ quan địa phương cấp phép"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4925", "tentieumuc": "Tiền chậm nộp thuế tài nguyên dầu, khí (không kể tiền chậm nộp thuế tài nguyên thu theo hiệp định, hợp đồng thăm dò khai thác dầu, khí)"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4926", "tentieumuc": "Tiền chậm nộp thuế tài nguyên về dầu thô thu theo hiệp định, hợp đồng."},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4927", "tentieumuc": "Tiền chậm nộp thuế tài nguyên khác còn lại."},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4928", "tentieumuc": "Tiền chậm nộp thuế giá trị gia tăng từ hàng hóa nhập khẩu"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4929", "tentieumuc": "Tiền chậm nộp thuế giá trị gia tăng từ hoạt động thăm dò, khai thác dầu, khí"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4931", "tentieumuc": "Tiền chậm nộp thuế giá trị gia tăng từ hàng hóa sản xuất kinh doanh trong nước khác còn lại"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4932", "tentieumuc": "Tiền chậm nộp thuế tiêu thụ đặc biệt hàng nhập khẩu"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4933", "tentieumuc": "Tiền chậm nộp thuế tiêu thụ đặc biệt hàng nhập khẩu bán ra trong nước."},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4934", "tentieumuc": "Tiền chậm nộp thuế tiêu thụ đặc biệt hàng hóa sản xuất kinh doanh trong nước khác còn lại"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4935", "tentieumuc": "Tiền chậm nộp thuế xuất khẩu"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4936", "tentieumuc": "Tiền chậm nộp thuế nhập khẩu"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4937", "tentieumuc": "Tiền chậm nộp thuế bảo vệ môi trường thu từ hàng hóa nhập khẩu"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4938", "tentieumuc": "Tiền chậm nộp thuế bảo vệ môi trường thu từ hàng hóa nhập khẩu bán ra trong nước"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4939", "tentieumuc": "Tiền chậm nộp thuế bảo vệ môi trường thu từ hàng hóa sản xuất, kinh doanh trong nước khác còn lại"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4941", "tentieumuc": "Tiền chậm nộp các khoản thu từ hoạt động xổ số kiến thiết"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4942", "tentieumuc": "Tiền chậm nộp đối với các khoản thu khác còn lại về dầu khí"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4943", "tentieumuc": "Tiền chậm nộp các khoản khác điều tiết 100% ngân sách trung ương theo quy định của pháp luật do ngành thuế quản lý. "},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4944", "tentieumuc": "Tiền chậm nộp các khoản khác còn lại theo quy định của pháp luật do ngành thuế quản lý. "},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4945", "tentieumuc": "Tiền chậm nộp các khoản khác theo quy định của pháp luật do ngành hải quan quản lý"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4946", "tentieumuc": "Tiền chậm nộp các khoản khác điều tiết 100% ngân sách trung ương theo quy định của pháp luật do ngành khác quản lý"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4947", "tentieumuc": "Tiền chậm nộp các khoản khác còn lại theo quy định của pháp luật do ngành khác quản lý"},
{"muc": "0", "tenmuc": "Các khoản thu khác", "tieumuc": "4949", "tentieumuc": "Các khoản thu khác"},
{"muc": "5050", "tenmuc": "Viện trợ cho đầu tư phát triển", "tieumuc": "5051", "tentieumuc": "Của các Chính phủ"},
{"muc": "5050", "tenmuc": "Viện trợ cho đầu tư phát triển", "tieumuc": "5052", "tentieumuc": "Của các tổ chức quốc tế"},
{"muc": "5050", "tenmuc": "Viện trợ cho đầu tư phát triển", "tieumuc": "5053", "tentieumuc": "Của các tổ chức phi Chính phủ"},
{"muc": "5050", "tenmuc": "Viện trợ cho đầu tư phát triển", "tieumuc": "5054", "tentieumuc": "Của các cá nhân và kiều bào nước ngoài"},
{"muc": "5050", "tenmuc": "Viện trợ cho đầu tư phát triển", "tieumuc": "5099", "tentieumuc": "Của các tổ chức khác"},
{"muc": "5100", "tenmuc": "Viện trợ cho chi thường xuyên", "tieumuc": "5101", "tentieumuc": "Của các Chính phủ"},
{"muc": "5100", "tenmuc": "Viện trợ cho chi thường xuyên", "tieumuc": "5102", "tentieumuc": "Của các tổ chức quốc tế"},
{"muc": "5100", "tenmuc": "Viện trợ cho chi thường xuyên", "tieumuc": "5103", "tentieumuc": "Của các tổ chức phi Chính phủ"},
{"muc": "5100", "tenmuc": "Viện trợ cho chi thường xuyên", "tieumuc": "5104", "tentieumuc": "Của các cá nhân và kiều bào nước ngoài"},
{"muc": "5100", "tenmuc": "Viện trợ cho chi thường xuyên", "tieumuc": "5149", "tentieumuc": "Của các tổ chức khác"},
{"muc": "5150", "tenmuc": "Viện trợ để cho vay lại", "tieumuc": "5151", "tentieumuc": "Của các Chính phủ"},
{"muc": "5150", "tenmuc": "Viện trợ để cho vay lại", "tieumuc": "5152", "tentieumuc": "Của các tổ chức quốc tế"},
{"muc": "5150", "tenmuc": "Viện trợ để cho vay lại", "tieumuc": "5153", "tentieumuc": "Của các tổ chức phi Chính phủ"},
{"muc": "5150", "tenmuc": "Viện trợ để cho vay lại", "tieumuc": "5154", "tentieumuc": "Của các cá nhân và kiều bào nước ngoài"},
{"muc": "5150", "tenmuc": "Viện trợ để cho vay lại", "tieumuc": "5199", "tentieumuc": "Của các tổ chức khác"},
{"muc": "5200", "tenmuc": "Viện trợ cho mục đích khác", "tieumuc": "5201", "tentieumuc": "Của các Chính phủ"},
{"muc": "5200", "tenmuc": "Viện trợ cho mục đích khác", "tieumuc": "5202", "tentieumuc": "Của các tổ chức quốc tế"},
{"muc": "5200", "tenmuc": "Viện trợ cho mục đích khác", "tieumuc": "5203", "tentieumuc": "Của các tổ chức phi Chính phủ"},
{"muc": "5200", "tenmuc": "Viện trợ cho mục đích khác", "tieumuc": "5204", "tentieumuc": "Của các cá nhân và kiều bào nước ngoài"},
{"muc": "5200", "tenmuc": "Viện trợ cho mục đích khác", "tieumuc": "5249", "tentieumuc": "Của các tổ chức khác"},
{"muc": "5350", "tenmuc": "Thu nợ gốc cho vay đầu tư phát triển", "tieumuc": "5351", "tentieumuc": "Thu nợ gốc cho vay bằng nguồn vốn trong nước"},
{"muc": "5350", "tenmuc": "Thu nợ gốc cho vay đầu tư phát triển", "tieumuc": "5352", "tentieumuc": "Thu nợ gốc cho vay bằng nguồn vốn ngoài nước"},
{"muc": "5350", "tenmuc": "Thu nợ gốc cho vay đầu tư phát triển", "tieumuc": "5399", "tentieumuc": "Thu nợ gốc cho vay đầu tư phát triển - Khác"},
{"muc": "5450", "tenmuc": "Thu nợ gốc cho nước ngoài vay", "tieumuc": "5450", "tentieumuc": "Thu nợ gốc cho nước ngoài vay"},
{"muc": "5450", "tenmuc": "Thu nợ gốc cho nước ngoài vay", "tieumuc": "5451", "tentieumuc": "Thu từ các khoản cho vay đối với các Chính phủ nước ngoài"},
{"muc": "5450", "tenmuc": "Thu nợ gốc cho nước ngoài vay", "tieumuc": "5452", "tentieumuc": "Thu từ các khoản cho vay đối với các tổ chức quốc tế"},
{"muc": "5450", "tenmuc": "Thu nợ gốc cho nước ngoài vay", "tieumuc": "5453", "tentieumuc": "Thu từ các khoản cho vay đối với các tổ chức tài chính và phi tài chính nước ngoài"},
{"muc": "5450", "tenmuc": "Thu nợ gốc cho nước ngoài vay", "tieumuc": "5499", "tentieumuc": "Thu nợ gốc cho nước ngoài vay - Khác"},
{"muc": "5550", "tenmuc": "Thu bán cổ phần của Nhà nước", "tieumuc": "5551", "tentieumuc": "Thu bán cổ phần các doanh nghiệp Nhà nước"},
{"muc": "5550", "tenmuc": "Thu bán cổ phần của Nhà nước", "tieumuc": "5552", "tentieumuc": "Thu bán cổ phần các liên doanh"},
{"muc": "6000", "tenmuc": "Tiền lương", "tieumuc": "6001", "tentieumuc": "Lương ngạch, bậc theo quỹ lương được duyệt"},
{"muc": "6000", "tenmuc": "Tiền lương", "tieumuc": "6002", "tentieumuc": "Lương tập sự, công chức dự bị"},
{"muc": "6000", "tenmuc": "Tiền lương", "tieumuc": "6003", "tentieumuc": "Lương hợp đồng dài hạn"},
{"muc": "6000", "tenmuc": "Tiền lương", "tieumuc": "6004", "tentieumuc": "Lương cán bộ công nhân viên dôi ra ngoài biên chế"},
{"muc": "6000", "tenmuc": "Tiền lương", "tieumuc": "6049", "tentieumuc": "Lương khác"},
{"muc": "6050", "tenmuc": "Tiền công trả cho lao động thường xuyên theo hợp đồng", "tieumuc": "6051", "tentieumuc": "Tiền công trả cho lao động thường xuyên theo hợp đồng"},
{"muc": "6050", "tenmuc": "Tiền công trả cho lao động thường xuyên theo hợp đồng", "tieumuc": "6099", "tentieumuc": "Tiền công trả cho lao động thường xuyên theo hợp đồng - Khác"},
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6101"", ""tentieumuc"": ""Phụ cấp chức vụ""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6102"", ""tentieumuc"": ""Phụ cấp khu vực""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6103"", ""tentieumuc"": ""Phụ cấp thu hút""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6104"", ""tentieumuc"": ""Phụ cấp đắt đỏ""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6105"", ""tentieumuc"": ""Phụ cấp làm đêm""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6106"", ""tentieumuc"": ""Phụ cấp thêm giờ""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6107"", ""tentieumuc"": ""Phụ cấp độc hại, nguy hiểm""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6108"", ""tentieumuc"": ""Phụ cấp lưu động""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6111"", ""tentieumuc"": ""Phụ cấp đại biểu Quốc hội, đại biểu Hội đồng nhân dân""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6112"", ""tentieumuc"": ""Phụ cấp ưu đãi nghề""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6113"", ""tentieumuc"": ""Phụ cấp trách nhiệm theo nghề, theo công việc""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6114"", ""tentieumuc"": ""Phụ cấp trực""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6115"", ""tentieumuc"": ""Phụ cấp thẩm niên nghề""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6116"", ""tentieumuc"": ""Phụ cấp đặc biệt khác của ngành""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6117"", ""tentieumuc"": ""Phụ cấp thẩm niên vượt khung""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6118"", ""tentieumuc"": ""Phụ cấp kiêm nhiệm""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6121"", ""tentieumuc"": ""Phụ cấp công tác lâu năm ở vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6122"", ""tentieumuc"": ""Phụ cấp theo loại xã""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6123"", ""tentieumuc"": ""Phụ cấp công tác Đảng, đoàn thể chính trị - xã hội""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6124"", ""tentieumuc"": ""Phụ cấp công vụ""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6125"", ""tentieumuc"": ""Thù lao cho các đối tượng theo chế độ quy định""},"
"{""muc"": ""6100"", ""tenmuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp)"", ""tieumuc"": ""6149"", ""tentieumuc"": ""Phụ cấp lương
(Các khoản chi tiền lương, các khoản phụ cấp của cán bộ chuyên trách, công chức cấp xã được hạch toán vào các Tiểu mục tương ứng của Mục 6000 “Tiền lương” và Mục 6100 “Phụ cấp lương” theo từng nội dung của khoản chi tiền lương, phụ cấp) - Khác""},"
{"muc": "6150", "tenmuc": "Học bổng học sinh, sinh viên", "tieumuc": "6151", "tentieumuc": "Học sinh trường năng khiếu"},
{"muc": "6150", "tenmuc": "Học bổng học sinh, sinh viên", "tieumuc": "6152", "tentieumuc": "Học sinh dân tộc nội trú"},
{"muc": "6150", "tenmuc": "Học bổng học sinh, sinh viên", "tieumuc": "6153", "tentieumuc": "Học sinh, sinh viên các trường phổ thông, đào tạo khác trong nước"},
{"muc": "6150", "tenmuc": "Học bổng học sinh, sinh viên", "tieumuc": "6154", "tentieumuc": "Học sinh, sinh viên đi học nước ngoài"},
{"muc": "6150", "tenmuc": "Học bổng học sinh, sinh viên", "tieumuc": "6155", "tentieumuc": "Sinh hoạt phí cán bộ đi học"},
{"muc": "6150", "tenmuc": "Học bổng học sinh, sinh viên", "tieumuc": "6199", "tentieumuc": "Học bổng học sinh, sinh viên - Khác"},
{"muc": "6200", "tenmuc": "Tiền thưởng", "tieumuc": "6201", "tentieumuc": "Thưởng thường xuyên theo định mức"},
{"muc": "6200", "tenmuc": "Tiền thưởng", "tieumuc": "6202", "tentieumuc": "Thưởng đột xuất theo định mức"},
{"muc": "6200", "tenmuc": "Tiền thưởng", "tieumuc": "6203", "tentieumuc": "Các chi phí khác theo chế độ liên quan đến công tác khen thưởng"},
{"muc": "6200", "tenmuc": "Tiền thưởng", "tieumuc": "6249", "tentieumuc": "Tiền thưởng - Khác"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6251", "tentieumuc": "Trợ cấp khó khăn thường xuyên"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6252", "tentieumuc": "Trợ cấp khó khăn đột xuất"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6253", "tentieumuc": "Tiền tàu xe nghỉ phép năm"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6254", "tentieumuc": "Tiền thuốc y tế trong các cơ quan, đơn vị"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6255", "tentieumuc": "Tiền hoá chất vệ sinh phòng dịch"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6256", "tentieumuc": "Tiền khám bệnh định kỳ"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6257", "tentieumuc": "Tiền nước uống"},
{"muc": "6250", "tenmuc": "Phúc lợi tập thể", "tieumuc": "6299", "tentieumuc": "Các khoản khác"},
{"muc": "6300", "tenmuc": "Các khoản đóng góp", "tieumuc": "6301", "tentieumuc": "Bảo hiểm xã hội"},
{"muc": "6300", "tenmuc": "Các khoản đóng góp", "tieumuc": "6302", "tentieumuc": "Bảo hiểm y tế"},
{"muc": "6300", "tenmuc": "Các khoản đóng góp", "tieumuc": "6303", "tentieumuc": "Kinh phí công đoàn"},
{"muc": "6300", "tenmuc": "Các khoản đóng góp", "tieumuc": "6304", "tentieumuc": "Bảo hiểm thất nghiệp"},
{"muc": "6300", "tenmuc": "Các khoản đóng góp", "tieumuc": "6349", "tentieumuc": "Các khoản đóng góp - Khác"},
{"muc": "0", "tenmuc": "Chi cho cán bộ xã, thôn, bản đương chức", "tieumuc": "6353", "tentieumuc": "Phụ cấp cán bộ không chuyên trách xã"},
{"muc": "0", "tenmuc": "Chi cho cán bộ xã, thôn, bản đương chức", "tieumuc": "6399", "tentieumuc": "Chi cho cán bộ xã, thôn, bản đương chức - Khác"},
{"muc": "6400", "tenmuc": "Các khoản thanh toán khác cho cá nhân", "tieumuc": "6401", "tentieumuc": "Tiền ăn"},
{"muc": "6400", "tenmuc": "Các khoản thanh toán khác cho cá nhân", "tieumuc": "6402", "tentieumuc": "Chi khám chữa bệnh cho cán bộ, công chức Việt Nam làm việc ở nước ngoài"},
{"muc": "6400", "tenmuc": "Các khoản thanh toán khác cho cá nhân", "tieumuc": "6403", "tentieumuc": "Sinh hoạt phí cho cán bộ, công chức Việt Nam làm việc ở  nước ngoài"},
{"muc": "6400", "tenmuc": "Các khoản thanh toán khác cho cá nhân", "tieumuc": "6404", "tentieumuc": "Chi chênh lệch thu nhập thực tế so với lương ngạch bậc, chức vụ"},
{"muc": "6400", "tenmuc": "Các khoản thanh toán khác cho cá nhân", "tieumuc": "6405", "tentieumuc": "Hỗ trợ đối tượng chính sách đóng học phí"},
{"muc": "6400", "tenmuc": "Các khoản thanh toán khác cho cá nhân", "tieumuc": "6406", "tentieumuc": "Hỗ trợ đối tượng chính sách chi phí học tập"},
{"muc": "6400", "tenmuc": "Các khoản thanh toán khác cho cá nhân", "tieumuc": "6449", "tentieumuc": "Trợ cấp, phụ cấp khác"},
{"muc": "6500", "tenmuc": "Thanh toán dịch vụ công cộng", "tieumuc": "6501", "tentieumuc": "Thanh toán tiền điện"},
{"muc": "6500", "tenmuc": "Thanh toán dịch vụ công cộng", "tieumuc": "6502", "tentieumuc": "Thanh toán tiền nước"},
{"muc": "6500", "tenmuc": "Thanh toán dịch vụ công cộng", "tieumuc": "6503", "tentieumuc": "Thanh toán tiền nhiên liệu"},
{"muc": "6500", "tenmuc": "Thanh toán dịch vụ công cộng", "tieumuc": "6504", "tentieumuc": "Thanh toán tiền vệ sinh, môi trường"},
{"muc": "6500", "tenmuc": "Thanh toán dịch vụ công cộng", "tieumuc": "6505", "tentieumuc": "Thanh toán khoán phương tiện theo chế độ"},
{"muc": "6500", "tenmuc": "Thanh toán dịch vụ công cộng", "tieumuc": "6549", "tentieumuc": "Thanh toán dịch vụ công cộng - Khác"},
{"muc": "6550", "tenmuc": "Vật tư văn phòng", "tieumuc": "6551", "tentieumuc": "Văn phòng phẩm"},
{"muc": "6550", "tenmuc": "Vật tư văn phòng", "tieumuc": "6552", "tentieumuc": "Mua sắm công cụ, dụng cụ văn phòng"},
{"muc": "6550", "tenmuc": "Vật tư văn phòng", "tieumuc": "6553", "tentieumuc": "Khoán văn phòng phẩm"},
{"muc": "6550", "tenmuc": "Vật tư văn phòng", "tieumuc": "6599", "tentieumuc": "Vật tư văn phòng khác"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6601", "tentieumuc": "Cước phí điện thoại trong nước"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6602", "tentieumuc": "Cước phí điện thoại quốc tế"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6603", "tentieumuc": "Cước phí bưu chính"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6604", "tentieumuc": "Fax"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6605", "tentieumuc": "Thuê bao kênh vệ tinh"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6606", "tentieumuc": "Tuyên truyền"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6607", "tentieumuc": "Quảng cáo"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6608", "tentieumuc": "Phim ảnh"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6611", "tentieumuc": "Ấn phẩm truyền thông"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6612", "tentieumuc": "Sách, báo, tạp chí thư viện"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6613", "tentieumuc": "Chi tuyên truyền, giáo dục pháp luật trong cơ quan, đơn vị theo chế độ"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6614", "tentieumuc": "Chi tủ sách pháp luật ở xã, phường, thị trấn theo chế độ"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6615", "tentieumuc": "Thuê bao đường điện thoại"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6616", "tentieumuc": "Thuê bao cáp truyền hình"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6617", "tentieumuc": "Cước phí Internet, thư viện điện tử"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6618", "tentieumuc": "Khoán điện thoại"},
{"muc": "6600", "tenmuc": "Thông tin, tuyên truyền, liên lạc", "tieumuc": "6649", "tentieumuc": "Thông tin, tuyên truyền, liên lạc - Khác"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6651", "tentieumuc": "In, mua tài liệu"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6652", "tentieumuc": "Bồi dưỡng giảng viên, báo cáo viên"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6653", "tentieumuc": "Tiền vé máy bay, tàu xe"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6654", "tentieumuc": "Tiền thuê phòng ngủ"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6655", "tentieumuc": "Thuê hội trường, phương tiện vận chuyển"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6656", "tentieumuc": "Thuê phiên dịch, biên dịch phục vụ hội nghị"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6657", "tentieumuc": "Các khoản thuê mướn khác phục vụ hội nghị"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6658", "tentieumuc": "Chi bù tiền ăn"},
{"muc": "6650", "tenmuc": "Hội nghị", "tieumuc": "6699", "tentieumuc": "Chi phí khác"},
{"muc": "6700", "tenmuc": "Công tác phí", "tieumuc": "6701", "tentieumuc": "Tiền vé máy bay, tàu, xe"},
{"muc": "6700", "tenmuc": "Công tác phí", "tieumuc": "6702", "tentieumuc": "Phụ cấp công tác phí"},
{"muc": "6700", "tenmuc": "Công tác phí", "tieumuc": "6703", "tentieumuc": "Tiền thuê phòng ngủ"},
{"muc": "6700", "tenmuc": "Công tác phí", "tieumuc": "6704", "tentieumuc": "Khoán công tác phí"},
{"muc": "6700", "tenmuc": "Công tác phí", "tieumuc": "6705", "tentieumuc": "Công tác phí của trưởng thôn, bản ở miền núi"},
{"muc": "6700", "tenmuc": "Công tác phí", "tieumuc": "6749", "tentieumuc": "Công tác phí - Khác"},
{"muc": "6750", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6751", "tentieumuc": "Thuê phương tiện vận chuyển"},
{"muc": "6750", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6752", "tentieumuc": "Thuê nhà"},
{"muc": "6750", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6753", "tentieumuc": "Thuê đất"},
{"muc": "6750", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6754", "tentieumuc": "Thuê thiết bị các loại"},
{"muc": "6750", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6755", "tentieumuc": "Thuê chuyên gia và giảng viên nước ngoài"},
{"muc": "6750", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6756", "tentieumuc": "Thuê chuyên gia và giảng viên trong nước"},
{"muc": "6750", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6757", "tentieumuc": "Thuê lao động trong nước"},
{"muc": "0", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6758", "tentieumuc": "Thuê đào tạo lại cán bộ"},
{"muc": "0", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6761", "tentieumuc": "Thuê phiên dịch, biên dịch phục vụ hội nghị"},
{"muc": "0", "tenmuc": "Chi phí thuê mướn", "tieumuc": "6799", "tentieumuc": "Chi phí thuê mướn khác"},
{"muc": "6800", "tenmuc": "Chi đoàn ra", "tieumuc": "6801", "tentieumuc": "Tiền vé máy bay, tàu, xe (bao gồm cả thuê phương tiện đi lại)"},
{"muc": "6800", "tenmuc": "Chi đoàn ra", "tieumuc": "6802", "tentieumuc": "Tiền ăn"},
{"muc": "6800", "tenmuc": "Chi đoàn ra", "tieumuc": "6803", "tentieumuc": "Tiền ở"},
{"muc": "6800", "tenmuc": "Chi đoàn ra", "tieumuc": "6804", "tentieumuc": "Tiền tiêu vặt"},
{"muc": "6800", "tenmuc": "Chi đoàn ra", "tieumuc": "6805", "tentieumuc": "Phí, lệ phí liên quan"},
{"muc": "6800", "tenmuc": "Chi đoàn ra", "tieumuc": "6806", "tentieumuc": "Khoán chi đoàn ra theo chế độ"},
{"muc": "6800", "tenmuc": "Chi đoàn ra", "tieumuc": "6849", "tentieumuc": "Chi đoàn ra - Khác"},
{"muc": "6850", "tenmuc": "Chi đoàn vào", "tieumuc": "6851", "tentieumuc": "Tiền vé máy bay, tàu, xe (bao gồm cả thuê phương tiện đi lại)"},
{"muc": "6850", "tenmuc": "Chi đoàn vào", "tieumuc": "6852", "tentieumuc": "Tiền ăn"},
{"muc": "6850", "tenmuc": "Chi đoàn vào", "tieumuc": "6853", "tentieumuc": "Tiền ở"},
{"muc": "6850", "tenmuc": "Chi đoàn vào", "tieumuc": "6854", "tentieumuc": "Tiền tiêu vặt"},
{"muc": "6850", "tenmuc": "Chi đoàn vào", "tieumuc": "6855", "tentieumuc": "Phí, lệ phí liên quan"},
{"muc": "6850", "tenmuc": "Chi đoàn vào", "tieumuc": "6856", "tentieumuc": "Khoán chi đoàn vào theo chế độ"},
{"muc": "6850", "tenmuc": "Chi đoàn vào", "tieumuc": "6899", "tentieumuc": "Chi đoàn vào - Khác"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6901", "tentieumuc": "Mô tô"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6902", "tentieumuc": "Ô tô con, ô tô tải"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6903", "tentieumuc": "Xe chuyên dùng"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6904", "tentieumuc": "Tàu, thuyền"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6905", "tentieumuc": "Trang thiết bị kỹ thuật chuyên dụng"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6906", "tentieumuc": "Điều hoà nhiệt độ"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6907", "tentieumuc": "Nhà cửa"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6908", "tentieumuc": "Thiết bị phòng cháy, chữa cháy"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6911", "tentieumuc": "Sách, tài liệu và chế độ dùng cho công tác chuyên môn"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6912", "tentieumuc": "Thiết bị tin học"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6913", "tentieumuc": "Máy photocopy"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6914", "tentieumuc": "Máy fax"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6915", "tentieumuc": "Máy phát điện"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6916", "tentieumuc": "Máy bơm nước"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6917", "tentieumuc": "Bảo trì và hoàn thiện phần mềm máy tính"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6918", "tentieumuc": "Công trình văn hoá, công viên, thể thao"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6921", "tentieumuc": "Đường điện, cấp thoát nước"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6922", "tentieumuc": "Đường sá, cầu cống, bến cảng, sân bay"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6923", "tentieumuc": "Đê điều, hồ đập, kênh mương"},
{"muc": "6900", "tenmuc": "Sửa chữa tài sản phục vụ công tác chuyên môn và duy tu, bảo ưỡng các công trình cơ sở hạ tầng từ kinh phí thường xuyên", "tieumuc": "6949", "tentieumuc": "Các tài sản và công trình hạ tầng cơ sở khác"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7001", "tentieumuc": "Chi mua hàng hoá, vật tư dùng cho chuyên môn của từng ngành"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7002", "tentieumuc": "Trang thiết bị kỹ thuật chuyên dụng (không phải là tài sản cố định)"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7003", "tentieumuc": "Chi mua, in ấn, phô tô tài liệu chỉ dùng cho chuyên môn của ngành"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7004", "tentieumuc": "Đồng phục, trang phục"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7005", "tentieumuc": "Bảo hộ lao động"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7006", "tentieumuc": "Sách, tài liệu, chế  độ  dùng cho công tác chuyên môn của ngành (không phải là tài sản cố định)"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7007", "tentieumuc": "Chi mua súc vật dùng cho hoạt động chuyên môn của ngành"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7008", "tentieumuc": "Chi mật phí"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7011", "tentieumuc": "Chi nuôi phạm nhân, can phạm"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7012", "tentieumuc": "Chi thanh toán hợp đồng thực hiện nghiệp vụ chuyên môn"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7013", "tentieumuc": "Chi trả nhuận bút theo chế độ"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7014", "tentieumuc": "Chi phí nghiệp vụ bảo quản theo chế độ"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7015", "tentieumuc": "Chi hỗ trợ xây dựng văn bản qui phạm pháp luật"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7016", "tentieumuc": "Chi phí nhập, xuất hàng dự trữ quốc gia"},
{"muc": "7000", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7017", "tentieumuc": "Chi khoán thực hiện đề tài nghiên cứu khoa học theo chế độ quy định "},
{"muc": "0", "tenmuc": "Chi phí nghiệp vụ chuyên môn của từng ngành", "tieumuc": "7049", "tentieumuc": "Chi phí khác"},
{"muc": "7100", "tenmuc": "Chi hỗ trợ kinh tế tập thể và dân cư", "tieumuc": "7101", "tentieumuc": "Chi di dân"},
{"muc": "7100", "tenmuc": "Chi hỗ trợ kinh tế tập thể và dân cư", "tieumuc": "7102", "tentieumuc": "Chi hỗ trợ các loại hình hợp tác xã"},
{"muc": "7100", "tenmuc": "Chi hỗ trợ kinh tế tập thể và dân cư", "tieumuc": "7103", "tentieumuc": "Chi trợ cấp dân cư"},
{"muc": "7100", "tenmuc": "Chi hỗ trợ kinh tế tập thể và dân cư", "tieumuc": "7104", "tentieumuc": "Chi đón tiếp, thăm hỏi đồng bào dân tộc"},
{"muc": "7100", "tenmuc": "Chi hỗ trợ kinh tế tập thể và dân cư", "tieumuc": "7149", "tentieumuc": "Chi hỗ trợ kinh tế tập thể và dân cư - Khác"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7151", "tentieumuc": "Trợ cấp hàng tháng"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7152", "tentieumuc": "Trợ cấp một lần"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7153", "tentieumuc": "Ưu đãi khác cho thương binh, bệnh binh"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7154", "tentieumuc": "Dụng cụ chỉnh hình"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7155", "tentieumuc": "Bảo hiểm y tế cho các đối tượng chính sách"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7156", "tentieumuc": "Trợ cấp trại viên các trại xã hội"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7157", "tentieumuc": "Chi công tác nghĩa trang và mộ liệt sĩ "},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7158", "tentieumuc": "Chi hỗ trợ hoạt động các cơ sở nuôi dưỡng thương binh tập trung và điều dưỡng luân phiên người có công với cách mạng, trung tâm xã hội"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7161", "tentieumuc": "Hỗ trợ nhà ở cho đối tượng ưu đãi"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7162", "tentieumuc": "Chi quà lễ, tết cho các đối tượng chính sách"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7163", "tentieumuc": "Chi sách báo cán bộ lão thành cách mạng"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7164", "tentieumuc": "Chi cho công tác quản lý"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7165", "tentieumuc": "Trợ cấp ưu đãi học tập cho đối tượng chính sách"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7166", "tentieumuc": "Điều trị, điều dưỡng (cả tiền thuốc)"},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7167", "tentieumuc": "Chi cho "Quỹ khám, chữa bệnh cho người nghèo""},
{"muc": "7150", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7168", "tentieumuc": "Chi thực hiện chế độ cứu trợ xã hội"},
{"muc": "0", "tenmuc": "Chi về công tác người có công với cách mạng và xã hội", "tieumuc": "7199", "tentieumuc": "Chi về công tác người có công với cách mạng và xã hội - Khác"},
{"muc": "7200", "tenmuc": "Trợ giá theo chính sách của Nhà nước", "tieumuc": "7201", "tentieumuc": "Trợ giá"},
{"muc": "7200", "tenmuc": "Trợ giá theo chính sách của Nhà nước", "tieumuc": "7202", "tentieumuc": "Trợ cước vận chuyển"},
{"muc": "7200", "tenmuc": "Trợ giá theo chính sách của Nhà nước", "tieumuc": "7203", "tentieumuc": "Cấp không thu tiền một số mặt hàng"},
{"muc": "7200", "tenmuc": "Trợ giá theo chính sách của Nhà nước", "tieumuc": "7249", "tentieumuc": "Trợ giá theo chính sách của Nhà nước - Khác"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7251", "tentieumuc": "Bảo hiểm y tế cho đối tượng hưởng bảo hiểm xã hội"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7252", "tentieumuc": "Lương hưu"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7253", "tentieumuc": "Chi cho công nhân cao su"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7254", "tentieumuc": "Trợ cấp mất sức lao động"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7255", "tentieumuc": "Trợ cấp tai nạn lao động, bệnh nghề nghiệp và trợ cấp phục vụ người bị tai nạn lao động"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7256", "tentieumuc": "Tiền tuất định suất"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7257", "tentieumuc": "Mai táng phí"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7258", "tentieumuc": "Lệ phí chi trả"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7261", "tentieumuc": "Trang cấp dụng cụ phục hồi chức năng"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7262", "tentieumuc": "Trợ cấp hàng tháng cho cán bộ xã nghỉ việc theo chế độ quy định"},
{"muc": "7250", "tenmuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội", "tieumuc": "7299", "tentieumuc": "Chi lương hưu và trợ cấp bảo hiểm xã hội - Khác"},
{"muc": "7300", "tenmuc": "Chi bổ sung cho ngân sách cấp dưới", "tieumuc": "7301", "tentieumuc": "Chi bổ sung cân đối ngân sách"},
{"muc": "7300", "tenmuc": "Chi bổ sung cho ngân sách cấp dưới", "tieumuc": "7302", "tentieumuc": "Chi bổ sung có mục tiêu bằng vốn vay nợ ngoài nước"},
{"muc": "7300", "tenmuc": "Chi bổ sung cho ngân sách cấp dưới", "tieumuc": "7303", "tentieumuc": "Chi bổ sung có mục tiêu bằng vốn viện trợ không hoàn lại"},
{"muc": "7300", "tenmuc": "Chi bổ sung cho ngân sách cấp dưới", "tieumuc": "7304", "tentieumuc": "Chi bổ  sung các chương trình, mục tiêu quốc gia và dự  án bằng nguồn vốn trong nước"},
{"muc": "7300", "tenmuc": "Chi bổ sung cho ngân sách cấp dưới", "tieumuc": "7305", "tentieumuc": "Chi bổ sung có mục tiêu bằng nguồn vốn trong nước để thực hiện các nhiệm vụ phát triển kinh tế - xã hội và chính sách"},
{"muc": "7300", "tenmuc": "Chi bổ sung cho ngân sách cấp dưới", "tieumuc": "7349", "tentieumuc": "Chi bổ sung khác"},
{"muc": "7350", "tenmuc": "Chi xúc tiến thương mại và các khoản phụ thu", "tieumuc": "7351", "tentieumuc": "Chi xúc tiến thương mại"},
{"muc": "7350", "tenmuc": "Chi xúc tiến thương mại và các khoản phụ thu", "tieumuc": "7352", "tentieumuc": "Chi từ phụ thu lắp đặt máy điện thoại"},
{"muc": "7350", "tenmuc": "Chi xúc tiến thương mại và các khoản phụ thu", "tieumuc": "7353", "tentieumuc": "Chi từ phụ thu giá bán điện"},
{"muc": "7350", "tenmuc": "Chi xúc tiến thương mại và các khoản phụ thu", "tieumuc": "7354", "tentieumuc": "Chi từ nguồn phụ thu giá bán nước"},
{"muc": "7350", "tenmuc": "Chi xúc tiến thương mại và các khoản phụ thu", "tieumuc": "7355", "tentieumuc": "Chi từ nguồn phụ thu giá mặt hàng nhựa (PVC)"},
{"muc": "7350", "tenmuc": "Chi xúc tiến thương mại và các khoản phụ thu", "tieumuc": "7399", "tentieumuc": "Các khoản khác"},
{"muc": "7400", "tenmuc": "Chi viện trợ", "tieumuc": "7401", "tentieumuc": "Chi đào tạo học sinh Lào (C)"},
{"muc": "7400", "tenmuc": "Chi viện trợ", "tieumuc": "7402", "tentieumuc": "Chi đào tạo học sinh Campuchia (K)"},
{"muc": "7400", "tenmuc": "Chi viện trợ", "tieumuc": "7403", "tentieumuc": "Chi viện trợ khác cho Lào (C)"},
{"muc": "7400", "tenmuc": "Chi viện trợ", "tieumuc": "7404", "tentieumuc": "Chi viện trợ khác cho Campuchia (K)"},
{"muc": "7400", "tenmuc": "Chi viện trợ", "tieumuc": "7405", "tentieumuc": "Chi thực hiện dự án đầu tư viện trợ cho Lào (C)"},
{"muc": "7400", "tenmuc": "Chi viện trợ", "tieumuc": "7406", "tentieumuc": "Chi thực hiện dự án đầu tư viện trợ cho Campuchia (K)"},
{"muc": "7400", "tenmuc": "Chi viện trợ", "tieumuc": "7449", "tentieumuc": "Các khoản chi viện trợ khác"},
{"muc": "7500", "tenmuc": "Chi bổ sung Quỹ dự trữ tài chính", "tieumuc": "7501", "tentieumuc": "Chi bổ sung Quỹ dự trữ tài chính"},
{"muc": "7500", "tenmuc": "Chi bổ sung Quỹ dự trữ tài chính", "tieumuc": "7549", "tentieumuc": "Chi bổ sung Quỹ dự trữ tài chính - Khác"},
{"muc": "7550", "tenmuc": "Chi hoàn thuế giá trị gia tăng", "tieumuc": "7551", "tentieumuc": "Chi hoàn thuế giá trị gia tăng"},
{"muc": "7550", "tenmuc": "Chi hoàn thuế giá trị gia tăng", "tieumuc": "7552", "tentieumuc": "Chi trả lãi do chậm hoàn trả thuế giá trị gia tăng theo chế độ quy định"},
{"muc": "7550", "tenmuc": "Chi hoàn thuế giá trị gia tăng", "tieumuc": "7599", "tentieumuc": "Chi hoàn thuế giá trị gia tăng - Khác"},
{"muc": "7600", "tenmuc": "Chi xử lý tài sản được xác lập sở hữu Nhà nước", "tieumuc": "7601", "tentieumuc": "Tài sản vô thừa nhận"},
{"muc": "7600", "tenmuc": "Chi xử lý tài sản được xác lập sở hữu Nhà nước", "tieumuc": "7602", "tentieumuc": "Di sản, khảo cổ tìm thấy trong lòng đất"},
{"muc": "7600", "tenmuc": "Chi xử lý tài sản được xác lập sở hữu Nhà nước", "tieumuc": "7603", "tentieumuc": "Tài sản không được quyền thừa kế"},
{"muc": "7600", "tenmuc": "Chi xử lý tài sản được xác lập sở hữu Nhà nước", "tieumuc": "7649", "tentieumuc": "Chi xử lý tài sản được xác lập sở hữu Nhà nước - Khác"},
{"muc": "7650", "tenmuc": "Chi trả các khoản thu năm trước và chi trả lãi do trả chậm", "tieumuc": "7651", "tentieumuc": "Chi hoàn trả các khoản thu do cơ quan hải quan quyết định"},
{"muc": "7650", "tenmuc": "Chi trả các khoản thu năm trước và chi trả lãi do trả chậm", "tieumuc": "7652", "tentieumuc": "Chi hoàn trả các khoản thu về thuế nội địa"},
{"muc": "7650", "tenmuc": "Chi trả các khoản thu năm trước và chi trả lãi do trả chậm", "tieumuc": "7653", "tentieumuc": "Chi hoàn trả các khoản thu về phí và lệ phí"},
{"muc": "7650", "tenmuc": "Chi trả các khoản thu năm trước và chi trả lãi do trả chậm", "tieumuc": "7654", "tentieumuc": "Chi trả lãi do trả chậm theo quyết định của cơ quan hải quan"},
{"muc": "7650", "tenmuc": "Chi trả các khoản thu năm trước và chi trả lãi do trả chậm", "tieumuc": "7655", "tentieumuc": "Chi trả lãi do trả chậm thuế nội địa"},
{"muc": "7650", "tenmuc": "Chi trả các khoản thu năm trước và chi trả lãi do trả chậm", "tieumuc": "7699", "tentieumuc": "Chi trả các khoản thu khác"},
{"muc": "7700", "tenmuc": "Chi nộp ngân sách cấp trên", "tieumuc": "7701", "tentieumuc": "Chi hoàn trả các khoản phát sinh trong năm"},
{"muc": "7700", "tenmuc": "Chi nộp ngân sách cấp trên", "tieumuc": "7702", "tentieumuc": "Chi hoàn trả các khoản phát sinh năm trước"},
{"muc": "7700", "tenmuc": "Chi nộp ngân sách cấp trên", "tieumuc": "7749", "tentieumuc": "Chi nộp ngân sách cấp trên - Khác"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7751", "tentieumuc": "Chênh lệch tỷ giá ngoại tệ ngân sách nhà nước"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7752", "tentieumuc": "Chi kỷ niệm các ngày lễ lớn"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7753", "tentieumuc": "Chi khắc phục hậu quả thiên tai cho các đơn vị dự toán và cho các doanh nghiệp"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7754", "tentieumuc": "Chi thưởng và chi phí xử lý các hành vi vi phạm pháp luật của các vụ xử lý không có thu hoặc thu không đủ chi"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7755", "tentieumuc": "Chi đón tiếp Việt kiều"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7756", "tentieumuc": "Chi các khoản phí và lệ phí của các đơn vị dự toán"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7757", "tentieumuc": "Chi bảo hiểm tài sản và phương tiện của các đơn vị dự toán"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7758", "tentieumuc": "Chi hỗ trợ khác"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7761", "tentieumuc": "Chi tiếp khách"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7762", "tentieumuc": "Chi bồi thường thiệt hại cho các đối tượng bị oan do cơ quan tố tụng gây ra theo chế độ qui định"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7763", "tentieumuc": "Chi bồi thường thiệt hại do công chức, viên chức nhà nước gây ra theo chế độ qui định"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7764", "tentieumuc": "Chi lập quỹ khen thưởng theo chế độ qui định"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7765", "tentieumuc": "Chi chiết khấu phát hành trái phiếu"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7766", "tentieumuc": "Cấp bù học phí cho cơ sở giáo dục đào tạo theo chế độ"},
{"muc": "7750", "tenmuc": "Chi khác", "tieumuc": "7799", "tentieumuc": "Chi các khoản khác"},
{"muc": "7850", "tenmuc": "Chi cho công tác Đảng ở tổ chức Đảng cơ sở và các cấp trên cơ sở", "tieumuc": "7851", "tentieumuc": "Chi mua báo, tạp chí của Đảng"},
{"muc": "7850", "tenmuc": "Chi cho công tác Đảng ở tổ chức Đảng cơ sở và các cấp trên cơ sở", "tieumuc": "7852", "tentieumuc": "Chi tổ chức đại hội Đảng"},
{"muc": "7850", "tenmuc": "Chi cho công tác Đảng ở tổ chức Đảng cơ sở và các cấp trên cơ sở", "tieumuc": "7853", "tentieumuc": "Chi khen thưởng hoạt động công tác Đảng"},
{"muc": "7850", "tenmuc": "Chi cho công tác Đảng ở tổ chức Đảng cơ sở và các cấp trên cơ sở", "tieumuc": "7854", "tentieumuc": "Chi thanh toán các dịch vụ công cộng, vật tư văn phòng, thông tin tuyên truyền, liên lạc; chi đào tạo, bồi dưỡng nghiệp vụ, công tác Đảng... và các chi phí Đảng vụ khác"},
{"muc": "7850", "tenmuc": "Chi cho công tác Đảng ở tổ chức Đảng cơ sở và các cấp trên cơ sở", "tieumuc": "7899", "tentieumuc": "Chi cho công tác Đảng ở tổ chức Đảng cơ sở và các cấp trên cơ sở - Khác"},
{"muc": "7900", "tenmuc": "Chi bầu cử Quốc hội và Hội đồng nhân dân các cấp theo nhiệm kỳ", "tieumuc": "7901", "tentieumuc": "Chi bầu cử Quốc hội"},
{"muc": "7900", "tenmuc": "Chi bầu cử Quốc hội và Hội đồng nhân dân các cấp theo nhiệm kỳ", "tieumuc": "7902", "tentieumuc": "Chi bầu cử Hội đồng nhân dân các cấp"},
{"muc": "7900", "tenmuc": "Chi bầu cử Quốc hội và Hội đồng nhân dân các cấp theo nhiệm kỳ", "tieumuc": "7949", "tentieumuc": "Chi bầu cử Quốc hội và Hội đồng nhân dân các cấp theo nhiệm kỳ - Khác"},
{"muc": "7950", "tenmuc": "Chi lập các quỹ của đơn vị thực hiện khoán chi và đơn vị sự nghiệp có thu", "tieumuc": "7951", "tentieumuc": "Chi lập quỹ dự phòng ổn định thu nhập của cơ quan nhà nước thực hiện chế độ tự chủ và của đơn vị sự nghiệp công lập"},
{"muc": "7950", "tenmuc": "Chi lập các quỹ của đơn vị thực hiện khoán chi và đơn vị sự nghiệp có thu", "tieumuc": "7952", "tentieumuc": "Chi lập quỹ phúc lợi của đơn vị sự nghiệp"},
{"muc": "7950", "tenmuc": "Chi lập các quỹ của đơn vị thực hiện khoán chi và đơn vị sự nghiệp có thu", "tieumuc": "7953", "tentieumuc": "Chi lập quỹ khen thưởng của đơn vị sự nghiệp"},
{"muc": "7950", "tenmuc": "Chi lập các quỹ của đơn vị thực hiện khoán chi và đơn vị sự nghiệp có thu", "tieumuc": "7954", "tentieumuc": "Chi lập quỹ phát triển hoạt động sự nghiệp của đơn vị sự nghiệp"},
{"muc": "7950", "tenmuc": "Chi lập các quỹ của đơn vị thực hiện khoán chi và đơn vị sự nghiệp có thu", "tieumuc": "7999", "tentieumuc": "Chi lập các quỹ của đơn vị thực hiện khoán chi và đơn vị sự nghiệp có thu - Khác"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8001", "tentieumuc": "Hỗ trợ trung tâm dịch vụ việc làm và phục hồi nhân phẩm"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8002", "tentieumuc": "Hỗ trợ giải quyết việc làm cho thương binh"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8003", "tentieumuc": "Hỗ trợ doanh nghiệp có nhiều lao động nữ"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8004", "tentieumuc": "Chi hỗ trợ đào tạo tay nghề"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8005", "tentieumuc": "Chi sắp xếp lao động khu vực doanh nghiệp Nhà nước"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8006", "tentieumuc": "Chi sắp xếp lao động khu vực hành chính - sự nghiệp"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8007", "tentieumuc": "Chi trợ cấp thôi việc cho người lao động ở nước ngoài về nước"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8008", "tentieumuc": "Chi hỗ trợ dạy nghề ngắn hạn cho lao động nông thôn"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8011", "tentieumuc": "Chi hỗ trợ dạy nghề và việc làm cho lao động là người tàn tật"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8012", "tentieumuc": "Chi thực hiện chính sách dạy nghề đối với học sinh dân tộc thiểu số nội trú theo chế độ"},
{"muc": "8000", "tenmuc": "Chi hỗ trợ và giải quyết việc làm", "tieumuc": "8049", "tentieumuc": "Chi hỗ trợ và giải quyết việc làm - Khác"},
{"muc": "8050", "tenmuc": "Chi hỗ trợ doanh nghiệp và Quỹ của Nhà nước", "tieumuc": "8051", "tentieumuc": "Hỗ trợ cho các doanh nghiệp"},
{"muc": "8050", "tenmuc": "Chi hỗ trợ doanh nghiệp và Quỹ của Nhà nước", "tieumuc": "8052", "tentieumuc": "Hỗ trợ doanh nghiệp công ích"},
{"muc": "8050", "tenmuc": "Chi hỗ trợ doanh nghiệp và Quỹ của Nhà nước", "tieumuc": "8053", "tentieumuc": "Hỗ trợ lãi suất tín dụng"},
{"muc": "8050", "tenmuc": "Chi hỗ trợ doanh nghiệp và Quỹ của Nhà nước", "tieumuc": "8054", "tentieumuc": "Hỗ trợ các doanh nghiệp thực hiện cổ phần hoá"},
{"muc": "8050", "tenmuc": "Chi hỗ trợ doanh nghiệp và Quỹ của Nhà nước", "tieumuc": "8055", "tentieumuc": "Hỗ trợ, bổ sung Quỹ bảo trì đường bộ"},
{"muc": "8050", "tenmuc": "Chi hỗ trợ doanh nghiệp và Quỹ của Nhà nước", "tieumuc": "8099", "tentieumuc": "Chi hỗ trợ doanh nghiệp và Quỹ của Nhà nước - Khác"},
{"muc": "8100", "tenmuc": "Hỗ trợ hoạt động tín dụng Nhà nước", "tieumuc": "8101", "tentieumuc": "Cấp bù chênh lệch lãi suất"},
{"muc": "8100", "tenmuc": "Hỗ trợ hoạt động tín dụng Nhà nước", "tieumuc": "8102", "tentieumuc": "Cấp phí quản lý"},
{"muc": "8100", "tenmuc": "Hỗ trợ hoạt động tín dụng Nhà nước", "tieumuc": "8103", "tentieumuc": "Hỗ trợ lãi suất sau đầu tư"},
{"muc": "8100", "tenmuc": "Hỗ trợ hoạt động tín dụng Nhà nước", "tieumuc": "8104", "tentieumuc": "Cấp hỗ trợ kinh phí hoạt động các quỹ"},
{"muc": "8100", "tenmuc": "Hỗ trợ hoạt động tín dụng Nhà nước", "tieumuc": "8149", "tentieumuc": "Hỗ trợ khác"},
{"muc": "8150", "tenmuc": "Chi quy hoạch", "tieumuc": "8151", "tentieumuc": "Chi quy hoạch tổng thể phát triển kinh tế - xã hội của cả nước, vùng, lãnh thổ"},
{"muc": "8150", "tenmuc": "Chi quy hoạch", "tieumuc": "8152", "tentieumuc": "Chi quy hoạch phát triển ngành, lĩnh vực, sản phẩm chủ yếu"},
{"muc": "8150", "tenmuc": "Chi quy hoạch", "tieumuc": "8153", "tentieumuc": "Chi quy hoạch xây dựng đô thị, điểm dân cư nông thôn"},
{"muc": "8150", "tenmuc": "Chi quy hoạch", "tieumuc": "8199", "tentieumuc": "Chi quy hoạch - Khác"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8301", "tentieumuc": "Vay tín phiếu kho bạc phát hành qua hệ thống Ngân hàng Nhà nước"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8302", "tentieumuc": "Vay tín phiếu, trái phiếu ngoại tệ đấu thầu qua hệ thống Ngân hàng Nhà nước"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8303", "tentieumuc": "Vay trái phiếu phát hành trực tiếp qua hệ thống Kho bạc Nhà nước"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8304", "tentieumuc": "Vay trái phiếu đấu thầu qua trung tâm chứng khoán phát hành ngang mệnh giá"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8305", "tentieumuc": "Vay trái phiếu đấu thầu qua trung tâm chứng khoán phát hành theo lô lớn"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8306", "tentieumuc": "Vay trái phiếu bảo lãnh phát hành ngang mệnh giá"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8307", "tentieumuc": "Vay trái phiếu bảo lãnh phát hành theo lô lớn"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8308", "tentieumuc": "Vay trái phiếu phát hành qua các đại lý"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8311", "tentieumuc": "Vay phát hành công trái xây dựng tổ quốc"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8312", "tentieumuc": "Vay các quỹ ngoài ngân sách"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8313", "tentieumuc": "Vay trái phiếu công trình Trung ương"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8314", "tentieumuc": "Huy động (vay) đầu tư của ngân sách địa phương"},
{"muc": "8300", "tenmuc": "Trả lãi tiền vay trong nước để đầu tư phát triển", "tieumuc": "8349", "tentieumuc": "Vay khác trong nước"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8351", "tentieumuc": "Vay tín phiếu kho bạc phát hành qua hệ thống Ngân hàng Nhà nước"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8352", "tentieumuc": "Vay tín phiếu, trái phiếu ngoại tệ đấu thầu qua hệ thống Ngân hàng Nhà nước"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8353", "tentieumuc": "Vay trái phiếu phát hành trực tiếp qua hệ thống Kho bạc Nhà nước"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8354", "tentieumuc": "Vay trái phiếu đấu thầu qua trung tâm chứng khoán phát hành ngang mệnh giá"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8355", "tentieumuc": "Vay trái phiếu đấu thầu qua trung tâm chứng khoán phát hành theo lô lớn"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8356", "tentieumuc": "Vay trái phiếu bảo lãnh phát hành ngang mệnh giá"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8357", "tentieumuc": "Vay trái phiếu bảo lãnh phát hành theo lô lớn"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8358", "tentieumuc": "Vay trái phiếu phát hành qua các đại lý"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8361", "tentieumuc": "Vay phát hành công trái xây dựng tổ quốc"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8362", "tentieumuc": "Vay các quỹ tài chính"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8363", "tentieumuc": "Vay Ngân hàng Nhà nước"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8364", "tentieumuc": "Vay của tư nhân"},
{"muc": "8350", "tenmuc": "Trả lãi tiền vay trong nước để dùng cho mục đích khác", "tieumuc": "8399", "tentieumuc": "Vay khác"},
{"muc": "8400", "tenmuc": "Trả lãi vay ngoài nước để đầu tư phát triển", "tieumuc": "8401", "tentieumuc": "Cho các tổ chức tài chính, tiền tệ quốc tế"},
{"muc": "8400", "tenmuc": "Trả lãi vay ngoài nước để đầu tư phát triển", "tieumuc": "8402", "tentieumuc": "Cho các Chính phủ và tổ chức tài chính, tín dụng nước ngoài"},
{"muc": "8400", "tenmuc": "Trả lãi vay ngoài nước để đầu tư phát triển", "tieumuc": "8403", "tentieumuc": "Cho các thương nhân nước ngoài"},
{"muc": "8400", "tenmuc": "Trả lãi vay ngoài nước để đầu tư phát triển", "tieumuc": "8404", "tentieumuc": "Cho nguồn phát hành trái phiếu ra thị trường vốn quốc tế"},
{"muc": "8400", "tenmuc": "Trả lãi vay ngoài nước để đầu tư phát triển", "tieumuc": "8449", "tentieumuc": "Cho các tổ chức nước ngoài khác"},
{"muc": "8450", "tenmuc": "Trả lãi vay ngoài nước cho vay lại", "tieumuc": "8451", "tentieumuc": "Cho các tổ chức tài chính, tiền tệ quốc tế"},
{"muc": "8450", "tenmuc": "Trả lãi vay ngoài nước cho vay lại", "tieumuc": "8452", "tentieumuc": "Cho các Chính phủ và tổ chức tài chính, tín dụng nước ngoài"},
{"muc": "8450", "tenmuc": "Trả lãi vay ngoài nước cho vay lại", "tieumuc": "8453", "tentieumuc": "Cho các thương nhân nước ngoài"},
{"muc": "8450", "tenmuc": "Trả lãi vay ngoài nước cho vay lại", "tieumuc": "8454", "tentieumuc": "Cho nguồn phát hành trái phiếu ra thị trường vốn quốc tế"},
{"muc": "8450", "tenmuc": "Trả lãi vay ngoài nước cho vay lại", "tieumuc": "8499", "tentieumuc": "Cho các tổ chức nước ngoài khác"},
{"muc": "8500", "tenmuc": "Trả lãi vay ngoài nước cho mục đích khác", "tieumuc": "8501", "tentieumuc": "Cho các tổ chức tài chính, tiền tệ quốc tế"},
{"muc": "8500", "tenmuc": "Trả lãi vay ngoài nước cho mục đích khác", "tieumuc": "8502", "tentieumuc": "Cho các Chính phủ và tổ chức tài chính, tín dụng nước ngoài"},
{"muc": "8500", "tenmuc": "Trả lãi vay ngoài nước cho mục đích khác", "tieumuc": "8503", "tentieumuc": "Cho các thương nhân nước ngoài"},
{"muc": "8500", "tenmuc": "Trả lãi vay ngoài nước cho mục đích khác", "tieumuc": "8504", "tentieumuc": "Cho nguồn phát hành trái phiếu ra thị trường vốn quốc tế"},
{"muc": "8500", "tenmuc": "Trả lãi vay ngoài nước cho mục đích khác", "tieumuc": "8549", "tentieumuc": "Cho các tổ chức nước ngoài khác"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8551", "tentieumuc": "Lệ phí hoa hồng"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8552", "tentieumuc": "Lệ phí rút tiền"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8553", "tentieumuc": "Phí phát hành, thanh toán tín phiếu, trái phiếu Chính phủ"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8554", "tentieumuc": "Lệ phí đi vay về cho vay lại"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8555", "tentieumuc": "Phí cam kết"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8556", "tentieumuc": "Phí bảo hiểm"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8557", "tentieumuc": "Phí quản lý"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8558", "tentieumuc": "Phí đàm phán"},
{"muc": "8550", "tenmuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay", "tieumuc": "8599", "tentieumuc": "Trả các khoản phí và lệ phí liên quan đến các khoản vay - Khác"},
{"muc": "8750", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước", "tieumuc": "8751", "tentieumuc": "Lương thực"},
{"muc": "8750", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước", "tieumuc": "8752", "tentieumuc": "Nhiên liệu"},
{"muc": "8750", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước", "tieumuc": "8753", "tentieumuc": "Vật tư kỹ thuật"},
{"muc": "8750", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước", "tieumuc": "8754", "tentieumuc": "Trang thiết bị kỹ thuật"},
{"muc": "8750", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước", "tieumuc": "8799", "tentieumuc": "Hàng hoá, vật tư dự trữ Nhà nước - Khác"},
{"muc": "8800", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước chuyên ngành", "tieumuc": "8801", "tentieumuc": "Lương thực"},
{"muc": "8800", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước chuyên ngành", "tieumuc": "8802", "tentieumuc": "Nhiên liệu"},
{"muc": "8800", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước chuyên ngành", "tieumuc": "8803", "tentieumuc": "Vật tư kỹ thuật"},
{"muc": "8800", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước chuyên ngành", "tieumuc": "8804", "tentieumuc": "Trang thiết bị kỹ thuật"},
{"muc": "8800", "tenmuc": "Hàng hoá, vật tư dự trữ Nhà nước chuyên ngành", "tieumuc": "8849", "tentieumuc": "Hàng hoá, vật tư dự trữ Nhà nước chuyên ngành - Khác"},
{"muc": "8950", "tenmuc": "Hỗ trợ vốn cho các doanh nghiệp và các quỹ", "tieumuc": "8951", "tentieumuc": "Vốn kinh doanh cho các doanh nghiệp Nhà nước"},
{"muc": "8950", "tenmuc": "Hỗ trợ vốn cho các doanh nghiệp và các quỹ", "tieumuc": "8952", "tentieumuc": "Cấp vốn điều lệ cho các doanh nghiệp"},
{"muc": "8950", "tenmuc": "Hỗ trợ vốn cho các doanh nghiệp và các quỹ", "tieumuc": "8953", "tentieumuc": "Cấp vốn điều lệ cho các quỹ"},
{"muc": "8950", "tenmuc": "Hỗ trợ vốn cho các doanh nghiệp và các quỹ", "tieumuc": "8999", "tentieumuc": "Hỗ trợ vốn cho các doanh nghiệp và các quỹ - Khác"},
{"muc": "9000", "tenmuc": "Mua, đầu tư tài sản vô hình", "tieumuc": "9001", "tentieumuc": "Mua bằng sáng chế"},
{"muc": "9000", "tenmuc": "Mua, đầu tư tài sản vô hình", "tieumuc": "9002", "tentieumuc": "Mua bản quyền nhãn hiệu thương mại"},
{"muc": "9000", "tenmuc": "Mua, đầu tư tài sản vô hình", "tieumuc": "9003", "tentieumuc": "Mua phần mềm máy tính"},
{"muc": "9000", "tenmuc": "Mua, đầu tư tài sản vô hình", "tieumuc": "9004", "tentieumuc": "Đầu tư, xây dựng phần mềm máy tính"},
{"muc": "9000", "tenmuc": "Mua, đầu tư tài sản vô hình", "tieumuc": "9049", "tentieumuc": "Mua, đầu tư tài sản vô hình - Khác"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9051", "tentieumuc": "Mô tô"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9052", "tentieumuc": "Ô tô con, ô tô tải"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9053", "tentieumuc": "Xe chuyên dùng"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9054", "tentieumuc": "Tàu, thuyền"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9055", "tentieumuc": "Trang thiết bị kỹ thuật chuyên dụng"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9056", "tentieumuc": "Điều hoà nhiệt độ"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9057", "tentieumuc": "Nhà cửa"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9058", "tentieumuc": "Thiết bị phòng cháy, chữa cháy"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9061", "tentieumuc": "Sách, tài liệu và chế độ dùng cho công tác chuyên môn"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9062", "tentieumuc": "Thiết bị tin học"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9063", "tentieumuc": "Máy photocopy"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9064", "tentieumuc": "Máy fax"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9065", "tentieumuc": "Máy phát điện"},
{"muc": "9050", "tenmuc": "Mua sắm tài sản dùng cho công tác chuyên môn", "tieumuc": "9099", "tentieumuc": "Tài sản khác"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9101", "tentieumuc": "Mô tô"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9102", "tentieumuc": "Ô tô con, ô tô tải"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9103", "tentieumuc": "Xe chuyên dùng"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9104", "tentieumuc": "Tàu, thuyền"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9105", "tentieumuc": "Trang thiết bị kỹ thuật chuyên dụng"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9106", "tentieumuc": "Điều hoà nhiệt độ"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9107", "tentieumuc": "Nhà cửa"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9108", "tentieumuc": "Thiết bị phòng cháy, chữa cháy"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9111", "tentieumuc": "Sách, tài liệu và chế độ dùng cho công tác chuyên môn"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9112", "tentieumuc": "Thiết bị tin học"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9113", "tentieumuc": "Máy photocopy"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9114", "tentieumuc": "Máy fax"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9115", "tentieumuc": "Máy phát điện"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9116", "tentieumuc": "Máy bơm nước"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9117", "tentieumuc": "Bảo trì và hoàn thiện phần mềm máy tính"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9118", "tentieumuc": "Công trình văn hoá, công viên, thể thao"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9121", "tentieumuc": "Đường điện, cấp thoát nước"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9122", "tentieumuc": "Đường sá, cầu cống, bến cảng, sân bay"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9123", "tentieumuc": "Đê điều, hồ đập, kênh mương"},
{"muc": "9100", "tenmuc": "Sửa chữa tài sản phục vụ chuyên môn và các công trình cơ sở hạ tầng từ kinh phí đầu tư ", "tieumuc": "9149", "tentieumuc": "Các tài sản và công trình hạ tầng cơ sở khác"},
{"muc": "9200", "tenmuc": "Chi chuẩn bị đầu tư", "tieumuc": "9201", "tentieumuc": "Chi điều tra, khảo sát"},
{"muc": "9200", "tenmuc": "Chi chuẩn bị đầu tư", "tieumuc": "9202", "tentieumuc": "Chi lập dự án đầu tư"},
{"muc": "9200", "tenmuc": "Chi chuẩn bị đầu tư", "tieumuc": "9203", "tentieumuc": "Chi tổ chức thẩm định dự án"},
{"muc": "9200", "tenmuc": "Chi chuẩn bị đầu tư", "tieumuc": "9204", "tentieumuc": "Chi đánh giá tác động của môi trường"},
{"muc": "9200", "tenmuc": "Chi chuẩn bị đầu tư", "tieumuc": "9249", "tentieumuc": "Chi phí khác"},
{"muc": "9250", "tenmuc": "Chi bồi thường giải phóng mặt bằng, tái định cư", "tieumuc": "9251", "tentieumuc": "Chi đền bù đất đai và các tài sản trên đất"},
{"muc": "9250", "tenmuc": "Chi bồi thường giải phóng mặt bằng, tái định cư", "tieumuc": "9252", "tentieumuc": "Chi thực hiện tái định cư"},
{"muc": "9250", "tenmuc": "Chi bồi thường giải phóng mặt bằng, tái định cư", "tieumuc": "9253", "tentieumuc": "Chi tổ chức bồi thường giải phóng mặt bằng"},
{"muc": "9250", "tenmuc": "Chi bồi thường giải phóng mặt bằng, tái định cư", "tieumuc": "9254", "tentieumuc": "Chi phí sử dụng đất trong thời gian xây dựng (nếu có)"},
{"muc": "9250", "tenmuc": "Chi bồi thường giải phóng mặt bằng, tái định cư", "tieumuc": "9255", "tentieumuc": "Chi đầu tư xây dựng hạ tầng kỹ thuật (nếu có)"},
{"muc": "9250", "tenmuc": "Chi bồi thường giải phóng mặt bằng, tái định cư", "tieumuc": "9299", "tentieumuc": "Chi bồi thường giải phóng mặt bằng, tái định cư - Khác"},
{"muc": "9300", "tenmuc": "Chi xây dựng", "tieumuc": "9301", "tentieumuc": "Chi xây dựng các công trình, hạng mục công trình"},
{"muc": "9300", "tenmuc": "Chi xây dựng", "tieumuc": "9302", "tentieumuc": "Chi phá và tháo dỡ các vật kiến trúc cũ"},
{"muc": "9300", "tenmuc": "Chi xây dựng", "tieumuc": "9303", "tentieumuc": "Chi san lấp mặt bằng xây dựng"},
{"muc": "9300", "tenmuc": "Chi xây dựng", "tieumuc": "9304", "tentieumuc": "Chi xây dựng công trình tạm, công trình phụ trợ phục vụ thi công"},
{"muc": "9300", "tenmuc": "Chi xây dựng", "tieumuc": "9349", "tentieumuc": "Chi khác"},
{"muc": "9350", "tenmuc": "Chi thiết bị", "tieumuc": "9351", "tentieumuc": "Chi mua sắm thiết bị công nghệ"},
{"muc": "9350", "tenmuc": "Chi thiết bị", "tieumuc": "9352", "tentieumuc": "Chi lắp đặt, thí nghiệm, hiệu chỉnh thiết bị"},
{"muc": "9350", "tenmuc": "Chi thiết bị", "tieumuc": "9353", "tentieumuc": "Chi đào tạo, chuyển giao công nghệ (nếu có)"},
{"muc": "9350", "tenmuc": "Chi thiết bị", "tieumuc": "9354", "tentieumuc": "Chi phí vận chuyển, bảo hiểm"},
{"muc": "9350", "tenmuc": "Chi thiết bị", "tieumuc": "9355", "tentieumuc": "Thuế và các loại phí liên quan"},
{"muc": "9350", "tenmuc": "Chi thiết bị", "tieumuc": "9399", "tentieumuc": "Chi thiết bị - Khác"},
{"muc": "9400", "tenmuc": "Chi phí khác", "tieumuc": "9401", "tentieumuc": "Chi phí quản lý dự án"},
{"muc": "9400", "tenmuc": "Chi phí khác", "tieumuc": "9402", "tentieumuc": "Chi phí tư vấn đầu tư xây dựng"},
{"muc": "9400", "tenmuc": "Chi phí khác", "tieumuc": "9403", "tentieumuc": "Lệ phí cấp đất xây dựng, cấp giấy phép xây dựng"},
{"muc": "9400", "tenmuc": "Chi phí khác", "tieumuc": "9404", "tentieumuc": "Chi phí thẩm tra và phê duyệt quyết toán, chi phí kiểm toán báo cáo quyết toán"},
{"muc": "9400", "tenmuc": "Chi phí khác", "tieumuc": "9449", "tentieumuc": "Chi phí khác - Khác"},
{"muc": "9500", "tenmuc": "Cho vay đầu tư phát triển", "tieumuc": "9501", "tentieumuc": "Cho vay bằng nguồn vốn trong nước"},
{"muc": "9500", "tenmuc": "Cho vay đầu tư phát triển", "tieumuc": "9502", "tentieumuc": "Cho vay bằng nguồn vốn ngoài nước"},
{"muc": "9500", "tenmuc": "Cho vay đầu tư phát triển", "tieumuc": "9549", "tentieumuc": "Cho vay đầu tư phát triển - Khác"},
{"muc": "9650", "tenmuc": "Cho nước ngoài vay", "tieumuc": "9651", "tentieumuc": "Cho các Chính phủ nước ngoài vay"},
{"muc": "9650", "tenmuc": "Cho nước ngoài vay", "tieumuc": "9652", "tentieumuc": "Cho các tổ chức quốc tế vay"},
{"muc": "9650", "tenmuc": "Cho nước ngoài vay", "tieumuc": "9653", "tentieumuc": "Cho các tổ chức tài chính và phi tài chính vay"},
{"muc": "9650", "tenmuc": "Cho nước ngoài vay", "tieumuc": "9699", "tentieumuc": "Cho nước ngoài vay - Khác"},
{"muc": "9700", "tenmuc": "Đóng góp với các tổ chức quốc tế và tham gia góp vốn của Nhà nước", "tieumuc": "9701", "tentieumuc": "Đóng góp với các tổ chức tài chính quốc tế"},
{"muc": "9700", "tenmuc": "Đóng góp với các tổ chức quốc tế và tham gia góp vốn của Nhà nước", "tieumuc": "9702", "tentieumuc": "Đóng niên liễm cho các tổ chức quốc tế"},
{"muc": "9700", "tenmuc": "Đóng góp với các tổ chức quốc tế và tham gia góp vốn của Nhà nước", "tieumuc": "9703", "tentieumuc": "Góp vốn liên doanh"},
{"muc": "9700", "tenmuc": "Đóng góp với các tổ chức quốc tế và tham gia góp vốn của Nhà nước", "tieumuc": "9704", "tentieumuc": "Góp vốn cổ phần"},
{"muc": "9700", "tenmuc": "Đóng góp với các tổ chức quốc tế và tham gia góp vốn của Nhà nước", "tieumuc": "9749", "tentieumuc": "Đóng góp với các tổ chức quốc tế và tham gia góp vốn của Nhà nước - Khác"}


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
