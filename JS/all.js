//下拉選單各行政區域(連結到相對應的圖示資料)
//熱門行政區連結到相對應的資料
//圖示與資料的渲染
//一頁顯示六個
//跳頁效果 
//滑動到最上方

/*---- 定義 ----*/
let select = document.querySelector("#travelarea");
let hotArea = document.querySelector(".arealist");
let mainList = document.querySelector(".infolist");
let page = document.querySelector(".pagination");
let goTop = document.querySelector(".gotop");
let dataAll;

/*撈資料*/
let url = "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
axios.get(url).then(function (res) {
    dataAll = res.data.result.records;
    console.log(res.data.result.records);
    renderReady();
    pageShow();
})
    .catch(function (err) {
        console.log(err);
    })

/*---------- 監聽 -------------*/
select.addEventListener("change", changeArea);
hotArea.addEventListener("click", changeArea);
page.addEventListener("click", goPage);
goTop.addEventListener("click", scrollToTop);


/*-------- 渲染畫面 ------------*/
//起始畫面
function renderReady() {
    //-------- 下拉選單顯示行政區--------

    //篩選出不重複的行政區陣列
    // 使用map運算出全部的區域，在用filter去過濾，把第一次出現的元素抓出去組成新的一個陣列
    const zoneNoRepeat = dataAll.map((item) => item.Zone).filter((item, index, array) => array.indexOf(item) === index);

    let optionStr = "";
    let optionDefault = `
    <option disabled="disabled" selected="true" value="--請選擇行政區--">--請選擇行政區--</option>
    <option value="高雄全部行政區">高雄全部行政區</option> `
    zoneNoRepeat.forEach(function (item) {
        let optionAdd = `<option value="${item}">${item}</option>`
        optionStr += optionAdd;
    });
    select.innerHTML = optionDefault + optionStr;

    //-------- 主要區域顯示行政區清單-------
    //全部顯示
    let mainStr = "";
    dataAll.forEach(function (item) {
        let li = `
        <li class="card">
            <div class="imgbox" style="background-image:url(${item.Picture1});">
                <h3>${item.Name}</h3>
                <p>${item.Zone}</p>
            </div>
            <div class="textbox">
                <p><img src="IMG/icons_clock.png">${item.Opentime}</p>
                <p><img src="IMG/icons_pin.png">${item.Add}</p>
                <span><img src="IMG/icons_phone.png">${item.Tel}</span>
                <p class="free"><img src="IMG/icons_tag.png">${item.Ticketinfo}</p>
            </div>
        </li>`
        mainStr += li;
    })
    document.querySelector(".main h2").textContent = "高雄全部行政區";
    mainList.innerHTML = mainStr;
    pageShow();
};


//切換行政區畫面
function changeArea(e) {
    let areaName = e.target.value;
    console.log(areaName);
    let mainStr = "";
    dataAll.forEach(function (item) {
        if (areaName == item.Zone) {
            let li = `
            <li class="card">
                <div class="imgbox" style="background-image:url(${item.Picture1});">
                    <h3>${item.Name}</h3>
                    <p>${item.Zone}</p>
                </div>
                <div class="textbox">
                    <p><img src="IMG/icons_clock.png">${item.Opentime}</p>
                    <p><img src="IMG/icons_pin.png">${item.Add}</p>
                    <span><img src="IMG/icons_phone.png">${item.Tel}</span>
                    <p class="free"><img src="IMG/icons_tag.png">${item.Ticketinfo}</p>
                </div>
            </li>`
            mainStr += li;
        } else if (areaName == "高雄全部行政區") {
            let li = `
            <li class="card">
                <div class="imgbox" style="background-image:url(${item.Picture1});">
                    <h3>${item.Name}</h3>
                    <p>${item.Zone}</p>
                </div>
                <div class="textbox">
                    <p><img src="IMG/icons_clock.png">${item.Opentime}</p>
                    <p><img src="IMG/icons_pin.png">${item.Add}</p>
                    <span><img src="IMG/icons_phone.png">${item.Tel}</span>
                    <p class="free"><img src="IMG/icons_tag.png">${item.Ticketinfo}</p>
                </div>
            </li>`
            mainStr += li;
        };
    });
    document.querySelector(".main h2").textContent = areaName;
    mainList.innerHTML = mainStr;
    nowPage = 0;
    pageShow();
}

//頁碼顯示
function pageShow() {
    let areaTotal = document.querySelectorAll(".card"); //抓出有多少個區域
    let perPage = 6; //每一頁要顯示的量
    let pageTotal = Math.ceil(areaTotal.length / perPage); //總頁數多少，如果有餘數，直接無條件進位
    let pageStr = ""; //頁碼文字
    let prevPageStr = `<a class="prevpage changePage" href="#title">&lsaquo; prev</a>` //上一頁
    let nextPageStr = ""; //下一頁
    // 如果總頁面大於一，才會顯示下一頁選項
    if (pageTotal > 1) {
        nextPageStr = `<a class="nextpage changePage" href="#title">next &rsaquo;</a>`
    };
    //產生頁數
    for (let i = 0; i < pageTotal; i++) {
        var pageContent = `<a href="#title" data-num="${i}">${i + 1}</a>`;
        pageStr += pageContent;
    };
    page.innerHTML = prevPageStr + pageStr + nextPageStr;
    //----------------一開始顯示六個資料-----------------------
    areaTotal.forEach(function (item, index) {
        if (index < 6) {
            item.style.display = "block";
        };
    });
};

let nowPage = 0; //一開始預設當頁面為0
//跳頁
function goPage(e) {
    // console.log(e.target.textContent);
    let areaTotal = document.querySelectorAll(".card");
    let perPage = 6;//每一頁要顯示的量
    let pageTotal = Math.ceil(areaTotal.length / perPage); //總頁數多少，如果有餘數，直接無條件進位
    let pageNum = Number(e.target.dataset.num); //觸擊的頁碼編號

    // 儲存當前的頁面
    if (pageNum >= 0 && pageNum < pageTotal) {
        nowPage = pageNum;
        goChangePage(nowPage);
    } else if (e.target.textContent === "next ›") {
        nowPage += 1;
        goChangePage(nowPage);
    } else if (e.target.textContent === "‹ prev") {
        nowPage -= 1;
        goChangePage(nowPage);
    }
    else { return };
    // console.log(nowPage)

    //顯示上下一頁
    if (nowPage > 0 && nowPage !== (pageTotal - 1)) {
        document.querySelector(".prevpage").style.display = "block";
        document.querySelector(".nextpage").style.display = "block";
    } else if (nowPage === 0) {
        document.querySelector(".prevpage").style.display = "none";
        document.querySelector(".nextpage").style.display = "block";
    } else if (nowPage === (pageTotal - 1)) {
        document.querySelector(".nextpage").style.display = "none";
        document.querySelector(".prevpage").style.display = "block";
    } else if (nowPage === 0 && nowPage === (pageTotal - 1)) {
        document.querySelector(".nextpage").style.display = "none";
    } else { return };

    //跳頁顯示畫面資料
    function goChangePage() {
        //每一頁要顯示的資料
        areaTotal.forEach(function (item, index) {
            //顯示的清單編號最大值與最小值公式(ex:編號0~6,6~11)
            let minNum = index * perPage;
            let maxNum = index * perPage + perPage;
            //當頁碼編號等於項目編號且頁碼編號不等於總頁數-1，才會顯示當頁該有的資料(篩選掉最後一頁的資訊)
            if (nowPage == index && nowPage !== (pageTotal - 1)) {
                for (let i = minNum; i < maxNum; i++) {
                    areaTotal[i].style.display = "block";
                };
                //隱藏該頁之後的清單
                for (let l = maxNum; l < areaTotal.length; l++) {
                    areaTotal[l].style.display = "none";
                };
                //隱藏該頁之前的清單
                for (let s = 0; s < minNum; s++) {
                    areaTotal[s].style.display = "none";
                };
            }
            //最後一頁還剩餘多少的資訊
            else if (nowPage == index && nowPage == (pageTotal - 1)) {
                for (let i = minNum; i < areaTotal.length; i++) {
                    areaTotal[i].style.display = "block";
                };
                //隱藏該頁之前的清單              
                for (let s = 0; s < minNum; s++) {
                    areaTotal[s].style.display = "none";
                };
            }
            else {
                return
            };
        });
    };

    //點擊頁碼變色
    let pageAll = document.querySelectorAll("a");
    pageAll.forEach(function (item) {
        item.classList.remove("active");
    });
    e.target.classList.add('active');
}



/*--------- 回到最上層 ----------*/
function scrollToTop(e) {
    e.preventDefault();
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
}

