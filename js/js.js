var url = "http://192.168.0.196:8080";

fetch(url, {
    method: "GET",
})
    .then((res) => {
        return res.json();
    })
    .then((res) => {
        window.localStorage.word_value = JSON.stringify(res);
    });

// 界面渲染和初始化
window.addEventListener("load", () => {
    changeDropdown();
    showWordList();
    if (window.location.href.substring(window.location.href.length - 3) == "?px") {
        change(1);
    } else {
        change(0);
    }
    mode = 0;
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
});

function changeDropdown() {
    dropdownC = "";
    for (i in map) {
        dropdownC += "<option>" + i + "</option>";
    }
    document.getElementById("dropdown").innerHTML = dropdownC;

    document.getElementById("dropdown").value = window.localStorage["drop"];
}

var dropdownValue;

function change(n) {
    dropdownValue = document.getElementById("dropdown").value;
    switch (n) {
        case 0:
            mode = 0; // mode是列表模式
            showList();
            break;
        case 1:
            mode = 1; // mode是拼写模式
            showSpell();
            break;
    }
    window.localStorage["drop"] = document.getElementById("dropdown").value;
    showWordList();
}

// 左边控件和单词表
function showWordList() {
    document.getElementById("control").innerHTML =
        checkboxClass("playC", "发音") +
        checkboxClass("playtC", "翻译发音") +
        checkboxClass("autoC", "自动播放") +
        checkboxClass("wordStyle", "样式") +
        checkboxClass("R", "random") +
        checkboxClass("bingC", "bing") +
        checkboxClass("wordC", "word") +
        checkboxClass("phoneticC", "phonetic") +
        checkboxClass("translationC", "translation") +
        '<select id="spellN"><option>1</option><option>2</option><option>3</option><option>4</option></select>';

    // 选项切换
    document.querySelector("#bingC").onclick = () => {};

    document.querySelector("#wordC").onclick = () => {
        console.log("hi");
        //
        if (document.querySelector("#wordC").checked) {
            document.querySelector(":root").setAttribute("style", "--display-word:visible");
        } else {
            document.querySelector(":root").setAttribute("style", "--display-word:hidden");
        }
    };
    document.querySelector("#phoneticC").onclick = () => {
        console.log("hi");
        //
        if (document.querySelector("#phoneticC").checked) {
            document.querySelector(":root").setAttribute("style", "--display-phonetic:visible");
        } else {
            document.querySelector(":root").setAttribute("style", "--display-phonetic:hidden");
        }
    };
    document.querySelector("#translationC").onclick = () => {
        console.log("hi");
        //
        if (document.querySelector("#translationC").checked) {
            document.querySelector(":root").setAttribute("style", "--display-translation:visible");
        } else {
            document.querySelector(":root").setAttribute("style", "--display-translation:hidden");
        }
    };

    // document.querySelector(':root').setAttribute('style', '--display-word:block');
    document.querySelector("#bingC").checked = window.localStorage["bingC"] == "true" ? true : false;
    document.querySelector("#wordC").checked = window.localStorage["wordC"] == "true" ? true : false;
    document.querySelector("#phoneticC").checked = window.localStorage["phoneticC"] == "true" ? true : false;
    document.querySelector("#translationC").checked = window.localStorage["translationC"] == "true" ? true : false;
    document.querySelector("#playC").checked = window.localStorage["playC"] == "true" ? true : false;
    document.querySelector("#spellN").value = window.localStorage["spellN"];
    document.querySelector("#R").checked = window.localStorage["R"] == "true" ? true : false;
}

function listS(v) {
    if (v == 0) {
        document.getElementById("List").style.transform = "translateX(-102%)";
    } else {
        document.getElementById("List").style.transform = "translateX(0)";
    }
}

function checkboxClass(id, name) {
    return (
        '<div class="mdc-form-field"><div class="mdc-checkbox"><input type="checkbox" class="mdc-checkbox__native-control" id="' +
        id +
        '" /><div class="mdc-checkbox__background"><svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24"><path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" /></svg><div class="mdc-checkbox__mixedmark"></div></div><div class="mdc-checkbox__ripple"></div></div><label for="' +
        id +
        '">' +
        name +
        "</label></div>"
    );
}

// 背书模式
function showList() {
    mode = 0;
    // document.getElementById('main').innerHTML = '<div id="wordDetail"><div id="word"></div><div id="phonetic"></div><div id="translation"></div><iframe id="bing" title="bing词典"></iframe></div>'

    var c = "";
    for (i = 1; i <= Math.ceil(map[dropdownValue].length / 50); i++) {
        c += `<li>${i}</li>`;
    }
    document.querySelector("#nav2").innerHTML = c;
    for (i = 0; i <= Math.ceil(map[dropdownValue].length / 50) - 1; i++) {
        ((i) => {
            document.querySelectorAll("#nav2>li")[i].onclick = () => {
                slow_load(i, 50);
            };
        })(i);
    }
    if (window.localStorage[dropdownValue] != undefined) {
        var page = JSON.parse(window.localStorage[dropdownValue]).page || 0;
    } else {
        var page = 0;
    }
    slow_load(page, 50);
}

word_num = 0;
word_value = JSON.parse(window.localStorage.word_value || "{}");
var page_w_l = [];

function slow_load(num, step) {
    if (num * step > map[dropdownValue].length) {
        return;
    }
    var c = "";
    page_w_l = [];
    for (i = num * step; i < (num + 1) * step && i < map[dropdownValue].length; i++) {
        id = map[dropdownValue][i];
        c += `<word-card word="${dic[id][0]}" phonetic="${dic[id][1]}" translation="${dic[id][2]}" value="${
            word_value[dic[id][0]]
        }"></word-card>`;
        page_w_l.push(id);
    }
    if (mode == 0) document.querySelector("#main").innerHTML = c;
    [].forEach.call(document.querySelectorAll("#nav2>li"), function (v) {
        v.className = "";
    });
    document.querySelectorAll("#nav2>li")[num].className = "nav2-li-h";

    var l = { page: num, page_step: step, w_n: word_num };
    window.localStorage[dropdownValue] = JSON.stringify(l);
}

function word_value_write(word, n) {
    var w = JSON.parse(window.localStorage.word_value || "{}");
    w[word] = n;
    window.localStorage.word_value = JSON.stringify(w);

    var data = { word: word, value: n };

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
    }).then((res) => res.json());
}

// 拼写模式
function showSpell() {
    mode = 1;
    document.getElementById("main").innerHTML =
        '<input id="spellWord" type="text" oninput="trueOrFalse()" autofocue="autofocue"><div id="word"></div><div id="phonetic"></div><div id="translation"></div>';

    if (window.localStorage[dropdownValue] != undefined) {
        next(JSON.parse(window.localStorage[dropdownValue]).w_n);
    } else {
        next(0);
    }
}

// 存储
var wptList, word, phonetic, translation, id;
n = 0;

function next(num) {
    n = document.getElementById("R").checked == true ? Math.floor(Math.random() * (page_w_l.length + 1)) : num; // n随机与否
    n = n < 0 ? 0 : n; // n must>=0

    wptList = {
        bingC: document.getElementById("bingC").checked,
        wordC: document.getElementById("wordC").checked,
        phoneticC: document.getElementById("phoneticC").checked,
        translationC: document.getElementById("translationC").checked,
        playC: document.getElementById("playC").checked,
    };

    id = page_w_l[n];
    word = dic[id][0];
    phonetic = dic[id][1];
    translation = dic[id][2];

    // 界面归位
    document.getElementById("translation").innerHTML = "";
    document.getElementById("phonetic").innerHTML = "";
    document.getElementById("word").innerHTML = "";

    // 根据选项展示
    if (mode == 0) {
        if (wptList["wordC"]) {
            document.getElementById("word").innerHTML =
                document.getElementById("wordStyle").checked == true ? aeiouy(word) : word;
        }
        if (wptList["phoneticC"]) {
            document.getElementById("phonetic").innerHTML = phonetic;
        }
        if (wptList["translationC"]) {
            document.getElementById("translation").innerHTML = to(translation);
        }
        if (document.getElementById("bingC").checked && wptList[0] && wptList[1] && wptList[2]) {
            document.getElementById("bing").src = "https://cn.bing.com/dict/search?q=" + dic[id][0];
        } else {
            document.getElementById("bing").src = "";
        }
    } else {
        document.getElementById("translation").innerHTML = to(translation);
        document.getElementById("spellWord").value = "";
        document.getElementById("spellWord").placeholder = "";
        spellNum = document.getElementById("spellN").value;
    }

    if (document.getElementById("playC").checked) {
        play(word);
    }

    // 选项存储
    location.href = "#" + n;
    window.localStorage[dropdownValue] = n;
    window.localStorage["bingC"] = document.getElementById("bingC").checked;
    window.localStorage["wordC"] = document.getElementById("wordC").checked;
    window.localStorage["phoneticC"] = document.getElementById("phoneticC").checked;
    window.localStorage["translationC"] = document.getElementById("translationC").checked;
    window.localStorage["palyC"] = document.getElementById("playC").checked;
    window.localStorage["R"] = document.getElementById("R").checked;
    window.localStorage["spellN"] = document.getElementById("spellN").value;
}

// 展示答案
function answer() {
    if (document.getElementById("bingC").checked) {
        document.getElementById("bing").src = "https://cn.bing.com/dict/search?q=" + dic[id][0];
    }
    if (!wptList["wordC"]) {
        document.getElementById("word").innerHTML =
            document.getElementById("wordStyle").checked == true ? aeiouy(word) : word;
    }
    if (!wptList["phoneticC"]) {
        document.getElementById("phonetic").innerHTML = phonetic;
    }
    if (!wptList["translationC"]) {
        document.getElementById("translation").innerHTML = to(translation);
    }
    play(word);
}

function play(word) {
    audio = document.getElementById("audio");
    // audio.src = 'http://tts.baidu.com/text2audio?lan=en&ie=UTF-8&spd=4&text=' + word
    if (document.getElementById("playtC").checked == true) {
        audio.src = "https://dict.youdao.com/dictvoice?le=eng&type=1&audio=" + word;
        audio.play();
        audio.onended = function () {
            audio.src = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=7&text=" + translation;
            audio.play();
            audio.onended = function () {};
        };
    } else {
        audio.src = "https://dict.youdao.com/dictvoice?le=eng&type=1&audio=" + word;
        audio.play();
    }
    if (document.getElementById("autoC").checked == true) {
        audio.onended = function () {
            next(Number(n) + 1);
        };
    } else {
        audio.onended = function () {};
    }
}

// 释义编排
function to(word) {
    word = word.replace(/【/g, "[").replace(/】/g, "]").replace(/（/g, "(").replace(/）/g, ")").replace(/，/g, ",");
    word = word.replace(/\s([a-z]+\.)/g, "</br>$&");
    word = word.replace(/；\s*<\/br>/g, "</br>");
    word = word.replace(/；/g, " | ");
    word = word.replace(/[a-z]+\./g, '<span class="cx">$&</span>');
    return word;
}
// 标记
function aeiouy(word) {
    // word = word.replace(/ /g,'<span class="space"></span>')
    word = word.replace(
        /(ai)|(air)|(al)|(ar)|(are)|(au)|(aw)|(ay)|(ea)|(ee)|(er)|(ear)|(eer)|(er)|(ere)|(ey)|(ie)|(ir)|(oa)|(oi)|(oo)|(oor)|(or)|(oor)|(our)|(ou)|(oy)|(ow)|(ur)/g,
        "<>$&</>"
    );
    word = word.replace(/(se)|(ch)|(th)|(sh)|(wh)|(tch)|(ds)|(ts)|(dr)|(tr)|(ing)|(cial)|(sion)|(tion)/g, "< >$&</ >");
    word = word.replace(/([aeiou])|(?<=[^aeiou])y/g, '<span class="aeiouy">$&</span>');
    word = word.replace(/<>/g, '<span class="yuan">');
    word = word.replace(/<\/>/g, "</span>");
    word = word.replace(/< >/g, '<span class="fu">');
    word = word.replace(/<\/ >/g, "</span>");
    // word = word.replace(/([aeiou])[^aeiou](e)/g, '<span class="aeiou_e">$&</span>')

    return word;
}

// 键盘
document.onkeyup = function (e) {
    var event = e || window.event;
    event.preventDefault();
    var key = event.which || event.keyCode || event.charCode;
    if (mode == 0) {
        // 列表模式下生效
        if (key == 37 || key == 38) {
            next(Number(n) - 1);
        }
        if (key == 39 || key == 40) {
            next(Number(n) + 1);
        }
        // if (key == 37 || key == 38 || key == 39 || key == 40) {
        // next(n)
        // }
        if (key == 13) {
            answer();
        }
    }
};

// 拼写判断
function trueOrFalse() {
    inputWord = document.getElementById("spellWord").value;
    document.getElementById("word").innerHTML = "";
    document.getElementById("phonetic").innerHTML = "";
    switch (inputWord) {
        case "~": // 暂时展示
            document.getElementById("word").innerHTML =
                document.getElementById("wordStyle").checked == true ? aeiouy(word) : word;
            document.getElementById("phonetic").innerHTML = phonetic;
            document.getElementById("spellWord").value = "";
            play(word);
            break;
        case "!": // 发音
            play(word);
            document.getElementById("spellWord").value = "";
            break;
        case word: // 正确
            if (spellNum == 1) {
                // 拼写次数降到1才下一个,否则重复拼写
                document.getElementById("spellWord").value = "";
                next(Number(n) + 1);
            } else {
                spellNum--;
                document.getElementById("spellWord").value = "";
                document.getElementById("spellWord").placeholder = "Good";
            }
            break;
    }
    //错误归位
    if (inputWord.length == word.length && inputWord != word) {
        document.getElementById("spellWord").value = "";
        document.getElementById("spellWord").placeholder = "Wrong";
        spellNum = document.getElementById("spellN").value;
    }
}
