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
        "answer": ["Xin chào! Tôi là một chú ROBOT tự động trả lời bạn. Rất vui khi được chat với bạn. Hãy thông cảm là tôi chỉ hiểu câu hỏi khi bạn viết tiếng Việt có dấu và hạn chế viết tắt nhé :)"]
    },
    {
        "description": "hỏi bạn là ai",
        "keyword": [[" mày là ai ", " bạn là ai ", " anh là ai ", " chị là ai ", " chú là ai ", " bác là ai ", " cụ là ai "]],
        "answer": ["Tôi là một chú ROBOT kekhaithue"]
    },
    {
        "description": "hỏi who am I",
        "keyword": [[" mày ", " bạn ", " anh ", " chị ", " chú ", " bác ", " cụ "], " biết ", [" tao ", " anh ", " chị ", " tôi "]," là ai "],
        "answer": ["Bạn là khách của tôi"]
    },
    {
        "description": "người dùng hỏi ai làm ra robot",
        "keyword": [[" ai làm ra ", " ai tạo ra ", " ai lập trình "], [" mày ", " bạn ", " anh ", " chị ", " chú ", " bác ", " cụ "]],
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
        "description": "Người dùng nói Không",
        "keyword": [[" không ", " uh "]],
        "answer": [":)"]
    },
    {
        "description": "Người dùng nói khen",
        "keyword": [[" giỏi đấy ", " giỏi lắm ", " khá khen ", " good "]],
        "answer": ["Cám ơn bạn. Ngại quá <3"]
    },
    {
        "description": "trả lời khi nói cám ơn",
        "keyword": [[" thanks ", " thankyou ", " thank ", " thank you ", " thank-you ", " cám ơn ", " cảm ơn "]],
        "answer": ["Cám ơn bạn đã sử dụng kekhaithue fanpage"]
    },
    {
        "description": "hỏi chung chung về Phần mềm",
        "keyword": [" phần mềm "],
        "answer": ["Bạn muốn hỏi về phần mềm nào? HTKK, iTaxViewer hay java..."]
    },
    {
        "description": "hỏi chung chung về htkk",
        "keyword": [" htkk "],
        "answer": ["Ứng dụng HTKK thuộc bản quyền của Tổng cục thuế. Đây là phần mềm được phát hành miễn phí cho các cơ sở SXKD nhằm hỗ trợ các đơn vị trong quá trình kê khai thuế"]
    },
    {
        "description": "phiên bản htkk hiện tại",
        "keyword": [" htkk ", " phiên bản "],
        "answer": ["function:htkk_version"]
    },
    {
        "description": "hỏi chung chung itaxviewer",
        "keyword": [[" itaxviewer ", " itaxview ", " itax "]],
        "answer": ["Bạn muốn hỏi về phần mềm iTaxViewer? iTaxViewer là ứng dụng hỗ trợ đọc, xác minh tờ khai, thông báo thuế định dạng XML. Tải phiên bản mới nhất tại đây http://adf.ly/1aAYfe"]
    },
    {
        "description": "Bạn có thể làm gì?",
        "keyword": [[" mày ", " bạn ", " anh ", " chị ", " chú ", " bác ", " cụ "], " có thể ", [" làm được gì ", " làm gì "]],
        "answer": ["Tôi có thể hướng dẫn căn bản cách khai và nộp thuế"]
    },
    {
        "description": "Khai thuế qua mạng là gì",
        "keyword": [[" khai thuế qua mạng là gì ", " kê khai qua mạng là gì ", " nộp tờ khai qua mạng là gì ", " nộp tk qua mạng là gì "]],
        "answer": ["Khai thuế qua mạng là việc người nộp thuế lập hồ sơ khai thuế trên máy vi tính của mình và gửi hồ sơ đến cơ quan thuế trực tiếp quản lý bằng mạng internet. Khai thuế qua mạng là dịch vụ Thuế điện tử được pháp luật về Thuế quy định"]
    },
    {
        "description": "Khai thuế qua mạng như thế nào",
        "keyword": [[" khai thuế ", " kê khai ", " nộp tờ khai ", " nộp tk ", " gửi tk ", " gửi tờ khai "], [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm thế nào ", " làm cách nào "]],
        "answer": ["Để khai thuế qua mạng bạn phải:\n- Cài đặt các phần mềm cần thiết.\n- Có chứng thư số\n- Đăng ký tài khoản trên trang http://kekhaithue.gdt.gov.vn \n- Bạn có thể xem cách nộp tại đây https://youtu.be/IMeg6n6reI0?list=PL9JVxqAVc8XOeyyFyzvo2udeyXTykr9W8"]
    },
    {
        "description": "Đăng ký khai thuế qua mạng như thế nào",
        "keyword": [" đăng ký ", [" khai thuế ", " kê khai ", " nộp tờ khai ", " nộp tk ", " gửi tk ", " gửi tờ khai "], [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm thế nào ", " làm cách nào "]],
        "answer": ["Bạn xem cách đăng ký khai thuế qua mạng tại đây https://youtu.be/LWJKaoqtAYI"]
    },
    {
        "description": "Nộp thuế qua mạng là gì",
        "keyword": [[" nộp thuế qua mạng là gì ", " nộp thuế điện tử là gì "]],
        "answer": ["Nộp thuế qua mạng là việc thực hiện các thủ tục nộp tiền vào Ngân sách nhà nước qua mạng máy tính mà không phải trực tiếp đến Ngân hàng hoặc Kho bạc. Nộp thuế qua mạng là dịch vụ Thuế điện tử được pháp luật về Thuế quy định"]
    },
    {
        "description": "Nộp thuế như thế nào",
        "keyword": [" nộp thuế ", [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm thế nào ", " làm cách nào "]],
        "answer": ["Để nộp thuế điện tử bạn phải:\n- Cài đặt các phần mềm cần thiết.\n- Có chứng thư số\n- Đăng ký tài khoản trên trang https://nopthue.gdt.gov.vn \n- Xem các video hướng dẫn nộp chi tiết tại đây http://bit.ly/videokhainopthue"]
    },
    {
        "description": "Đăng ký nộp thuế điện tử như thế nào",
        "keyword": [" đăng ký ", " nộp thuế ", [" thế nào ", " bằng cách nào ", " hướng dẫn ", " kiểu gì ", " làm cách nào "]],
        "answer": ["Bạn xem cách đăng ký nộp thuế tại đây https://youtu.be/kgsTeNWyjQs"]
    },


    {
        "description": "so PIN la gi",
        "keyword": [[" số pin ", " pin ", " mã pin "]],
        "answer": ["Số PIN hay mã PIN là mật khẩu của chữ ký số"]
    },
    {
        "description": "chữ ký số là gì",
        "keyword": [[" chứng thư số ", " chữ ký số ", " usb token ", " bút ký "]],
        "answer": ["Chữ ký số còn được gọi là chứng thư số là một con dấu để xác nhận văn bản này là của của Doanh nghiệp sử dụng để ký vào văn bản. Chữ ký số có hình dạng như một chiếc USB được gọi là USB Token"]
    },
    {
        "description": "chữ ký số lưu những thông tin gì",
        "keyword": [[" chứng thư số ", " chữ ký số ", " usb token ", " bút ký "], [" có gì ", " lưu gì ", " thông tin "]],
        "answer": ["Thông tin có trong chữ ký số:\n- Tên của Doanh nghiệp bao gồm: Mã số thuế, Tên Công ty… \n- Số hiệu của chứng thư số (số serial) \n- Thời hạn có hiệu lực của chứng thư số \n- Tên của tổ chức chứng thực chữ ký số \n..."]
    },
    {
        "description": "mua chữ ký số của ai",
        "keyword": [[" chứng thư số ", " chữ ký số ", " usb token ", " bút ký "], [" mua ", " bán "], [" của ai ", " của công ty nào ", " ở đâu ", " chỗ nào ", " nơi nào "]],
        "answer": ["Bạn xem danh sách các công ty cung cấp chứng thư số ở đây nhé http://adf.ly/1aE2UO"]
    },
    
    {
        "description": "gửi tk báo lỗi phiên bản tk không đúng",
        "keyword": [" lỗi ", " phiên bản ", [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "]],
        "answer": ["Bạn hãy tải HTKK phiên bản mới nhất về cài đặt, sau đó kết xuất tờ khai gửi lại", "Tải phiên bản mới nhất tại đây http://adf.ly/1aAYdJ"]
    }, 
    {
        "description": "gửi tk báo lỗi xsd",
        "keyword": [[" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "], " lỗi ", " sai tại dòng ", " xsd "],
        "answer": ["Đây là lỗi cấu trúc của tờ khai. Bạn xem lại các bảng kê của tk", "Các mst trên bảng kê có đúng không: không có dấu cách, có dấu gạch ngang nếu là mst chi nhánh, ...", "TK GTGT theo quy định không cần gửi phụ lục 01-1, 01-2 nữa nên bạn xóa 2 PL này đi", "Nếu không rơi vào 2 trường hợp lỗi trên bạn liên lạc với bộ phận hỗ trợ của CQT để được trợ giúp"]
    },
    {
        "description": "gửi bảng kê word/excel báo lỗi package should contain a content type part",
        "keyword": [[" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk "], [" word ", " excel "], " lỗi ", " package should contain a content type part "],
        "answer": ["Bạn vào Control Panel > Click vào Java > Chọn General > Chọn Settings... -> Delete Files... > Nhấn nút OK"]
    },
    {
        "description": "hỏi chung chung Không gửi được tk/gửi tk lỗi",
        "keyword":[[" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " gửi bảng kê ", " gửi bk ", " nộp bảng kê ", " nộp bk "], [" không được ", " lỗi "]],
        "answer": ["Bạn hãy mô tả chi tiết lỗi gặp phải nhé"]
    },
    {
        "description": "hỏi chung chung Không gửi được tk/gửi tk lỗi",
        "keyword":[[" không gửi ", " không nộp "], [" tờ khai ", " tk "]],
        "answer": ["Bạn hãy mô tả chi tiết lỗi gặp phải nhé"]
    },
    {
        "description": "gửi tk báo lỗi hso chưa đăng ký nộp qua mạng",
        "keyword": [[" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "], " lỗi ", [" hồ sơ chưa đăng ký nộp qua mạng ", " hồ sơ chưa đăng ký qua mạng ", " hồ sơ chưa đăng ký ", " chưa đăng ký "]],
        "answer": ["Do tờ khai chưa được đăng ký nộp. Bạn vào TÀI KHOẢN > ĐĂNG KÝ TỜ KHAI để đăng ký", "Bạn xem chi tiết tại đây http://lehoangdieu.blogspot.com/2016/02/ang-ky-to-khai-phai-nop-qua-mang.html"]
    },
    {
        "description": "hỏi có được đổi tên file tk không",
        "keyword": [" đổi tên ", [" file ", " tệp tờ khai ", " tệp tk "], " xml "],
        "answer": ["Bạn có thể đổi tên file tờ khai xml khi gửi qua trang kekhaithue.gdt.gov.vn", "Nếu gửi tờ khai qua trang tncnonline.com.vn thì bạn không được đổi tên file"]
    },
    {
        "description": "hỏi về gửi tk pdf",
        "keyword": [" gửi ", [" tờ khai ", " tk "], " pdf "],
        "answer": ["Tờ khai định dạng pdf chỉ được gửi qua trang kekhaithue đến hết tháng 3/2015. Sau thời điểm này mọi tờ khai gửi phải là định dạng xml. Riêng các bảng kê hoặc thuyết minh BCTC thì vẫn gửi văn bản định dạng word hoặc excel"]
    },
    {
        "description": "hỏi về gửi tk xml",
        "keyword": [" gửi ", [" tờ khai ", " tk "], " xml "],
        "answer": ["Tờ khai định dạng xml bắt đầu được gửi từ tháng 4/2015. Riêng các bảng kê hoặc thuyết minh BCTC thì vẫn gửi văn bản định dạng word hoặc excel. Để đọc file tờ khai này bạn cài phần mềm iTaxViewer"]
    },
    {
        "description": "cách gửi bke/thuyết minh",
        "keyword": [" gửi ", [" bảng kê ", " bk ", " thuyết minh "], [" cách ", " thế nào "]],
        "answer": ["Các bảng kê hoặc thuyết minh BCTC bạn gửi file định dạng word hoặc excel. Cách làm bạn xem tại đây http://lehoangdieu.blogspot.com/2016/02/nop-thuyet-minh-bctc-qua-mang.html"]
    },
    {
        "description": "vào htkk báo lỗi error",
        "keyword": [" htkk ", " lỗi ", " error "],
        "answer": ["Bạn xem lại quyền user trên máy tính sử dụng đã đủ quyền chưa? Hoặc bạn phải restart lại máy tính sau khi cài đặt HTKK"]
    },
    {
        "description": "lập tk bsung trên htkk báo lỗi error",
        "keyword": [" htkk ", " lỗi ", " error ", [" tk ", " tờ khai "], [" bổ sung ", " bổ xung "]],
        "answer": ["Bạn xem lại định dạng ngày tháng trên máy tính nhé"]
    },
    {
        "description": "gửi tk báo lỗi chưa đến thời kỳ làm bc",
        "keyword": [" lỗi ", " chưa đến thời kỳ ", [" làm báo cáo ", " làm bc "]],
        "answer": ["Bạn xem lại năm tài chính đã khai báo trên HTKK (vào HỆ THỐNG > THÔNG TIN DN) hoặc ngày tháng trên máy tính bạn đang bị sai"]
    },
    {
        "description": "chức năng của java",
        "keyword": [" java ", [" chức năng ", " mục đích ", " tác dụng "], " cài ", [" làm gì ", " để làm gì ", " sao "]],
        "answer": ["Java có tác dụng trong khai và nộp thuế điện tử: Dùng để chọn tệp tờ khai, ký tệp tờ khai, ký giấy nộp tiền và xác nhận để đổi mật khẩu"]
    },
    {
        "description": "cài đặt java",
        "keyword": [[" cài ", " setup ", " thiết lập ", " cấu hình "], " java "],
        "answer": ["Bạn xem hướng dẫn cài và cấu hình java ở đây nhé http://lehoangdieu.blogspot.com/2016/02/thiet-lap-java-e-khai-nop-thue.html"]
    },
    {
        "description": "nâng cấp java",
        "keyword": [[" nâng cấp ", " update "], " java "],
        "answer": ["Bạn xem khi nào phải nâng cấp và cách nâng cấp java ở đây https://youtu.be/sAp46t5dxFY"]
    },
    {
        "description": "báo đang tải thư viện mà không hiện nút chọn tệp tờ khai",
        "keyword": [[[" đang tải thư viện ", " tải thư viện "], [" lâu ", " mãi "]], [[" nút chọn tệp tờ khai ", " chọn tệp tờ khai "], [" không có ", " không xuất hiện ", " không hiện ", " không nhìn thấy ", " không thấy "]]],
        "answer": ["Có lẽ bạn bị lỗi java hoặc chưa enable java trên trình duyệt IE. Java không hoạt động thì sẽ không xuất hiện nút CHỌN TỆP TỜ KHAI. Bạn hãy cài lại java phiên bản mới nhất trên trang java.com nhé"]
    },
    {
        "description": "vào kekhaithue báo lỗi we were unable to return you to...",
        "keyword": [" vào ", [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " nộp tờ khai "], " we were unable to return you to "],
        "answer": ["Trên trình duyệt bạn chọn TOOLS > COMPATIBILITY VIEW SETTINGS > Nhấn ADD"]
    },
    {
        "description": "Nộp tk bằng cái gì?",
        "keyword": [[" sử dụng ", " dùng "], [" trình duyệt ", " cái gì ", " bằng gì "], [" kekhaithue ", " nhantokhai ", " kê khai thuế ", " gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk "]],
        "answer": ["Bạn có thể sử dụng trình duyệt Internet Explorer để gửi tk.\nVới Firefox, Chrome hoặc Cốc Cốc để GỬI TỜ KHAI qua trang kekhaithue.gdt.gov.vn bạn xem hướng dẫn này nhé http://adf.ly/10096599/ihtkktrenff"]
    },
    {
        "description": "Dùng trình duyệt nào để nộp thuế",
        "keyword": [[" sử dụng ", " dùng "], " trình duyệt ", [" nộp thuế ", " nộp tiền thuế ", " nộp tiền "]],
        "answer": ["Bạn sử dụng trình duyệt Internet Explorer để nộp tiền thuế qua mạng. Với các trình duyệt Firefox, Chrome hoặc Cốc Cốc phải cài đặt thêm Fire IE như sau http://lehoangdieu.blogspot.com/2016/02/nop-thue-bang-trinh-duyet-firefox.html"]
    },
    {
        "description": "hỏi làm thế nào để nộp tk và nộp thuế",
        "keyword": [[" làm thế nào ", " như thế nào ", " làm sao ", " cách nào "], [" nộp thuế ", " nộp tiền thuế ", " nộp tiền ", " kê khai thuế ", " gửi tờ khai ", " nộp tờ khai "]],
        "answer": ["Bạn phải cài HTKK để lập tờ khai, sử dụng 1 trình duyệt web, cài đặt java, có chữ ký số, cài đặt phần mềm quản lý chữ ký số để khai và nộp thuế qua mạng", "Bạn có thể xem hướng dẫn căn bản tại http://bit.ly/videokhainopthue"]
    },
    {
        "description": "lỗi java.lang.null hoặc internal server error",
        "keyword": [" lỗi ", [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế "], [" java . lang ", " internal server error ", " internal server "]],
        "answer": ["Nếu website hiển thị thông báo java.lang.null hoặc internal server error thì đây là lỗi của website. Bạn hãy đợi 1 lát nữa rồi vào làm lại"]
    },
    {
        "description": "lỗi chứng thư số chưa đăng ký với cqt",
        "keyword": [" lỗi ", [" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế "], [" chứng thư số chưa đăng ký ", " chứng thư số không đăng ký ", " chứng thư số đăng ký "]],
        "answer": ["Bạn vào TÀI KHOẢN > THAY ĐỔI THÔNG TIN > Nhấn vào THAY ĐỔI SỐ SERIAL"]
    },
    {
        "description": "lỗi sai số PIN hoặc ko tìm thấy chứng thư số",
        "keyword": [" lỗi ", [" sai số pin ", " không tìm thấy chứng thư số ", " không tìm thấy chứng thư "], [[" gửi tờ khai ", " gửi tk ", " nộp tờ khai ", " nộp tk ", " nộp thuế "], " kê khai thuế ", " khai thuế "], [" chứng thư số chưa đăng ký ", " chứng thư số không đăng ký ", " chứng thư số đăng ký "]],
        "answer": ["Bạn đã cài phần mềm quản lý chữ ký số chưa? Nếu cài rồi thì bạn vào phần mềm kiểm tra lại số PIN xem có đúng không hay chứng thư có bị khóa không"]
    },
    {
        "description": "Những đối tượng NNT nào được tham gia Nộp thuế điện tử?",
        "keyword": [" được ", [" nộp thuế điện tử ", " nộp thuế qua mạng ", " nộp thuế "]],
        "answer": ["NNT đảm bảo đầy đủ những điều kiện sau có thể tham gia nộp thuế điện tử: \n - Là tổ chức, doanh nghiệp được cấp mã số thuế/mã số doanh nghiệp và đang hoạt động \n - Có chứng thư số do tổ chức cung cấp dịch vụ chứng thực chữ ký số công cộng cấp và đang còn hiệu lực \n - Có kết nối Internet và địa chỉ thư điện tử liên lạc ổn định với Cơ quan thuế \n - Đang thực hiện khai thuế điện tử trên Cổng thông tin điện tử của Cơ quan thuế \n - Có tài khoản tại một trong những Ngân hàng thương mại triển khai NTDT với TCT"]
    },
    {
        "description": "NNT đang thực hiện kê khai thuế qua mạng tại các nhà TVAN có tham gia NTDT được không?",
        "keyword": [[" doanh nghiệp ", " dn ", " nnt ", " người nộp thuế ", " công ty ", " tôi ", " tao ", " mình "]," đang ", [" khai thuế qua mạng ", " khai thuế "], [" qua tvan ", " qua t-van "], [" có được ", " có tham gia ", " có thể "], [" nộp thuế điện tử ", " nộp thuế qua mạng "]],
        "answer": ["Có bạn nhé. NNT khai thuế qua mạng qua TVAN có thể tham gia nộp thuế điện tử tại nopthue.gdt.gov.vn của TCT"]
    },
    {
        "description": "Chữ ký số  được sử dụng trong Nộp thuế điện tử cho thể là chữ ký số được sử dụng Khai thuế qua mạng hay không",
        "keyword": [[" chứng thư số ", " chữ ký số ", " usb token ", " bút ký "], [" sử dụng ", " dùng trong "], [" khai thuế ", " nộp tờ khai ", " nộp tk "], [" dùng để ", " dùng chung "], [" nộp thuế "]],
        "answer": ["Chữ ký số trong nộp thuế và Chữ ký số sử dụng trong khai thuế giống nhau, tuy nhiên vẫn có thể sử dụng hai chữ ký số khác nhau cho hai ứng dụng này, tùy bạn lựa chọn"]
    },
    {
        "description": "NNT được đăng ký sử dụng Nộp thuế điện tử tối đa với bao nhiêu Ngân hàng",
        "keyword": [" đăng ký ", " nộp thuế ", " bao nhiêu ", [" ngân hàng ", " nh "]],
        "answer": ["Bạn có thể đăng ký với tất cả các  ngân hàng đã kết nối với hệ thống của Tổng cục Thuế.\nDanh sách các NH xem tại đây http://adf.ly/10096599/dangkyntdt"]
    },
    {
        "description": "NNT có thể đăng ký sử dụng Nộp thuế điện tử ở đâu",
        "keyword": [" đăng ký ", " nộp thuế ", [" tại đâu ", " ở đâu ", " ở trang nào ", " tại trang nào ", " cổng thông tin nào ", " cổng nào "]],
        "answer": ["Bạn có thể đăng ký nộp thuế điện tử tại https://nopthue.gdt.gov.vn của TCT hoặc các trang web của các đơn vị TVAN"]
    },
    {
        "description": "Đăng ký Nộp thuế điện tử với thông tin sai thì phải làm như thế nào",
        "keyword": [" đăng ký ", " nộp thuế ", [" sai thông tin ", " nhầm thông tin ", " thông tin sai ", " thông tin nhầm "], [" làm thế nào ", " làm như thế nào "]],
        "answer": [" - Nếu bạn đăng ký nhầm ngân hàng: liên lạc với NH để NH từ chối đăng ký. \n - Nếu đăng ký nhầm thông tin như email, số điện thoại: liên lạc với NH để sửa lại thông tin"]
    },
    {
        "description": "Các phần mềm cần cài để khai nộp thuế",
        "keyword": [" phần mềm ", [" cần thiết ", " cài "]],
        "answer": ["Bạn cần cài những phần mềm sau để khai nộp thuế:\n- HTKK: lập tờ khai\n- iTaxViewer: xem TK\n- Java: đọc và ký TK, chứng từ,...\n- Phần mềm quản lý bút ký\n- Trình duyệt web"]
    }
]

var a_sorry = "[ROBOT] Rất tiếc vì tôi chưa có dữ liệu bạn cần. Hãy thông cảm là tôi chỉ hiểu câu hỏi khi bạn viết tiếng Việt có dấu và hạn chế viết tắt nhé"


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
    //good_str(a.b) => a . b
    //good_str(a,b) => a , b
    //good_str(a?b) => a ? b
    //good_str(a!b) => a ! b
    //good_str(a;b) => a ; b
    return (((((str.trim()).replace(/\./g, " . ")).replace(/,/g, " , ")).replace(/\;/g, " ; ")).replace(/\?/g, " ? ")).replace(/\!/g, " ! ")
}
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
            var a_item = -1
            var keyword_num = 0
            var keyword_result = 0
            for (var i = 0; i < a_len; i++) {
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
            }
            
            if (a_item < 0) {
                sendTextMessage(sender, a_sorry)
            } else {
                if (a[a_item]["answer"][0] == "function:help"){
                    sendTextMessage(sender, help(a, 5))
                } else if (a[a_item]["answer"][0] == "function:htkk_version"){
                    sendTextMessage(sender, htkk_version())
                } else {
                    for (var i=0; i < a[a_item]["answer"].length; i++){
                            sendTextMessage(sender, a[a_item]["answer"][i])
                    }
                }
            }
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

//var str = "htkk là gì"
//str = " " + str + " "


/*
var a_len = a.length
var a_item = -1
var keyword_num = 0
var keyword_result = 0
for (var i = 0; i < a_len; i++) {
    if (check(str, a[i]["keyword"]) >= keyword_num){
        if ((Number(a[i]["keyword"].length) - Number(check(str, a[i]["keyword"])) <= Number(keyword_result) - Number(keyword_num)) || a_item == -1) {
            a_item = i
            keyword_result = a[i]["keyword"].length
            keyword_num = check(str, a[i]["keyword"])
        }
    }
}
*/