var store = JSON.parse(window.localStorage.rmbw || "{}");
function save() {
    window.localStorage.rmbw = JSON.stringify(store);
    fetch(url, {
        method: "POST",
        body: JSON.stringify(store),
    }).then((res) => res.json());
}
window.onbeforeunload = () => {
    save();
};
setInterval(save, 5 * 60 * 1000);

var url = "http://" + (store["sql"] || "0.0.0.0") + ":8888";

fetch(url, {
    method: "GET",
})
    .then((res) => {
        return res.json();
    })
    .then((res) => {
        // 合并数据，res覆盖相同键的值
        Object.assign(store, res);
    });

// 界面渲染和初始化
window.addEventListener("load", () => {
    changeDropdown();
    showWordList();
    if (window.location.href.substring(window.location.href.length - 3) == "?px") {
        change(false);
        showSpell();
    } else {
        change(true);
        change_b_list();
    }
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js");
    }
});

var dropdownValue;
function changeDropdown() {
    dropdownC = "";
    for (i in map) {
        dropdownC += "<option>" + i + "</option>";
    }
    document.getElementById("dropdown").innerHTML = dropdownC;

    if (store["drop"]) document.getElementById("dropdown").value = dropdownValue = store["drop"];
}

// 词书切换按钮
document.getElementById("dropdown").addEventListener("change", () => {
    change_b_list();
});

// 模式切换按钮
var mode = false;
document.getElementById("mode_b").onclick = () => {
    mode = !mode;
    change(mode);
};

function change(n) {
    mode = n;
    var l = document.querySelectorAll("word-card");
    if (n) {
        document.getElementById("mode_b").innerHTML = "背词";
        for (i in l) {
            l[i].spell = false;
        }
    } else {
        document.getElementById("mode_b").innerHTML = "拼写";
        for (i in l) {
            l[i].spell = true;
        }
    }
    showWordList();
}

// 左边控件和单词表
function showWordList() {
    document.getElementById("control").innerHTML =
        checkboxClass("list", "列表模式") +
        checkboxClass("playC", "发音") +
        checkboxClass("playtC", "翻译发音") +
        checkboxClass("autoC", "自动播放") +
        checkboxClass("wordStyle", "样式") +
        checkboxClass("R", "random") +
        checkboxClass("bingC", "bing") +
        checkboxClass("wordC", "word") +
        checkboxClass("phoneticC", "phonetic") +
        checkboxClass("translationC", "translation") +
        `<input type="number" min="1" id="spellN" value="${store.spellN || 3}">
        <input type=text placeholder="数据库地址" id="sql" value="${store.sql || "0.0.0.0"}">
        <input type=text placeholder="词典key" id="dic_key" value="${store.dic_key || ""}">`;

    // 选项切换
    document.querySelector("#bingC").onclick = () => {};

    // document.querySelector(':root').setAttribute('style', '--display-word:block');
    document.getElementById("list").checked = store["list"];
    document.getElementById("bingC").checked = store["bingC"];
    document.getElementById("wordC").checked = store["wordC"];
    document.getElementById("phoneticC").checked = store["phoneticC"];
    document.getElementById("translationC").checked = store["translationC"];
    document.getElementById("playC").checked = store["playC"];
    document.getElementById("playtC").checked = store["playtC"];
    document.getElementById("autoC").checked = store["autoC"];
    document.getElementById("wordStyle").checked = store["wordStyle"];
    document.getElementById("spellN").value = store["spellN"];
    document.getElementById("R").checked = store["R"];
    check();
    // 选项存储
    document.getElementById("control").onclick = () => {
        store["list"] = document.getElementById("list").checked;
        store["bingC"] = document.getElementById("bingC").checked;
        store["wordC"] = document.getElementById("wordC").checked;
        store["phoneticC"] = document.getElementById("phoneticC").checked;
        store["translationC"] = document.getElementById("translationC").checked;
        store["playC"] = document.getElementById("playC").checked;
        store["playtC"] = document.getElementById("playtC").checked;
        store["autoC"] = document.getElementById("autoC").checked;
        store["wordStyle"] = document.getElementById("wordStyle").checked;
        store["R"] = document.getElementById("R").checked;
        check();
    };

    document.getElementById("spellN").oninput = () => {
        store["spellN"] = document.getElementById("spellN").value;
    };
    document.getElementById("sql").oninput = () => {
        store["sql"] = document.getElementById("sql").value;
        url = "http://" + (store["sql"] || "0.0.0.0") + ":8080";
    };
    document.getElementById("dic_key").oninput = () => {
        store["dic_key"] = document.getElementById("dic_key").value;
    };

    function check() {
        big_list(document.getElementById("list").checked);

        if (document.querySelector("#wordC").checked) {
            document.documentElement.style.setProperty("--display-word", "visible");
        } else {
            document.documentElement.style.setProperty("--display-word", "hidden");
        }
        if (document.querySelector("#phoneticC").checked) {
            document.documentElement.style.setProperty("--display-phonetic", "visible");
        } else {
            document.documentElement.style.setProperty("--display-phonetic", "hidden");
        }
        if (document.querySelector("#translationC").checked) {
            document.documentElement.style.setProperty("--display-translation", "visible");
        } else {
            document.documentElement.style.setProperty("--display-translation", "hidden");
        }
        if (document.querySelector("#wordStyle").checked) {
            document.documentElement.style.setProperty("--display-aeiouy", "underline");
        } else {
            document.documentElement.style.setProperty("--display-aeiouy", "none");
        }
    }
}

function listS(v) {
    if (v == 0) {
        document.getElementById("List").style.transform = "translateX(-102%)";
    } else {
        document.getElementById("List").style.transform = "translateX(0)";
    }
}
document.getElementById("list_show").addEventListener("click", () => {
    listS(1);
});
document.getElementById("list_disappear").addEventListener("click", () => {
    listS(0);
});

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

// 底部页数栏
function change_b_list() {
    store["drop"] = dropdownValue = document.getElementById("dropdown").value;
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
    if (store[dropdownValue]) {
        var page = store[dropdownValue].page || 0;
    } else {
        store[dropdownValue] = { page: 0, page_step: 50, w_n: 0 };
        var page = 0;
    }
    slow_load(page, 50);
    can_record_p = false;
    next(store[dropdownValue].w_n);
    can_record_p = true;
}

word_num = 0;
word_value = store.word_value || {};
var page_w_l = [];

function slow_load(num, step) {
    if (num * step > map[dropdownValue].length) {
        return;
    }
    var c = "";
    page_w_l = [];
    word_value = store.word_value || {};
    for (i = num * step; i < (num + 1) * step && i < map[dropdownValue].length; i++) {
        id = map[dropdownValue][i];
        c += `<div><word-card word="${dic[id][0]}" phonetic="${dic[id][1]}" translation="${dic[id][2]}" value="${
            word_value[dic[id][0]]
        }" n="${i}"></word-card></div>`;
        page_w_l.push(id);
    }
    can_record_p = false;
    document.querySelector("#main").innerHTML = c;
    document.getElementById("main").scrollTop = 0;
    can_record_p = true;
    [].forEach.call(document.querySelectorAll("#nav2>li"), function (v) {
        v.className = "";
    });
    document.querySelectorAll("#nav2>li")[num].className = "nav2-li-h";

    store[dropdownValue].page_step = step;
    store[dropdownValue].page = num;

    save();
}

var can_record_p = false;
// 判断滚动到某个单词
var io = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) {
            var card_el = entries[0].target.querySelector("word-card");
            // 记录位置
            if (can_record_p) {
                console.log(card_el.getAttribute("word"));
                word_num = (card_el.getAttribute("n") - 0) % store[dropdownValue].page_step;
                store[dropdownValue].w_n = word_num;
            }
            // 自动播放
            if (store.autoC && !store["list"]) {
                play(card_el.getAttribute("word"));
            }

            if (!store["list"]) {
                syllable(card_el.getAttribute("word"), card_el.querySelector("#word-main"));
                word_more(card_el.getAttribute("word"));
            }
        }
    },
    {
        threshold: 0.75,
    }
);

async function word_more(word) {
    var more_r = await more(word);
    var more_stems = more_r[0].meta.stems;
    more_stems = `<span>${more_stems.join("</span><span>")}</span>`;
    if (more_r[0].et) {
        var more_et = more_r[0].et[0][1];
        var et_o = {
            "{b}": "<strong>",
            "{/b}": "</strong>",
            "{inf}": "<sub>",
            "{/inf}": "</sub>",
            "{it}": "<i>",
            "{/it}": "</i>",
            "{sc}": "<small>",
            "{/sc}": "</small>",
            "{sup}": "<sup>",
            "{/sup}": "</sup>",
            "{ldquo}": "&ldquo;",
            "{rdquo}": "&rdquo;",
            "{bc}": "<strong>: </strong>",
        };
        for (i in et_o) {
            more_et = more_et.replace(RegExp(i, "g"), et_o[i]);
        }
        more_et = more_et.replace(/{.*}/g, "");
    } else {
        more_et = "";
    }
    var more_short_def = more_r[0].shortdef;
    more_short_def = `<li>${more_short_def.join("</li><li>")}</li>`;
    document.querySelector(
        `word-card[word="${word}"] #more`
    ).innerHTML = `<div id="stems">${more_stems}</div><div id="def">${more_short_def}</div><div id="et">${more_et}</div>`;
}

function word_value_write(word, n) {
    if (!store.word_value) store.word_value = {};
    store.word_value[word] = n;
}

function big_list(v) {
    var l = document.querySelectorAll("word-card");
    if (v) {
        document.getElementById("main").style.scrollSnapType = "none";
        document.documentElement.style.setProperty("--main-div-height", "auto");
        for (i in l) {
            l[i].show = false;
        }
    } else {
        document.getElementById("main").style.scrollSnapType = "";
        document.documentElement.style.setProperty("--main-div-height", "100%");
        for (i in l) {
            l[i].show = true;
        }
    }
}

// 存储
var wptList, word, phonetic, translation, id;
n = 0;

function next(num) {
    n = document.getElementById("R").checked == true ? Math.floor(Math.random() * (page_w_l.length + 1)) : num; // n随机与否
    n = n < 0 ? 0 : n; // n must>=0

    id = page_w_l[n];
    word = dic[id][0];
    phonetic = dic[id][1];
    translation = dic[id][2];

    if (document.getElementById("playC").checked) {
        play(word);
    }

    document.getElementById("main").scrollTop =
        document.querySelector(`word-card[word="${word}"]`).offsetTop - document.getElementById("main").offsetTop;

    if (!mode) {
        document.querySelector(`word-card[word="${word}"] #spellWord`).focus();
    }
}

// var spellNum = document.getElementById("spellN").value - 0;
// 展示答案
function answer(el, w, p, t) {
    el.querySelector("#word").innerHTML = w;
    el.querySelector("#phonetic").innerHTML = p;
    el.querySelector("#translation").innerHTML = t;
    play(w);
}

function play(word) {
    audio = document.getElementById("audio");
    audio.src = "https://dict.youdao.com/dictvoice?le=eng&type=1&audio=" + word;
    audio.play();
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
    word1 = word.replace(
        /(ai)|(air)|(al)|(ar)|(are)|(au)|(aw)|(ay)|(ea)|(ee)|(er)|(ear)|(eer)|(er)|(ere)|(ey)|(ie)|(ir)|(oa)|(oi)|(oo)|(oor)|(or)|(oor)|(our)|(ou)|(oy)|(ow)|(ur)/g,
        "<>$&</>"
    );
    word1 = word1.replace(
        /(se)|(ch)|(th)|(sh)|(wh)|(tch)|(ds)|(ts)|(dr)|(tr)|(ing)|(cial)|(sion)|(tion)/g,
        "< >$&</ >"
    );
    word1 = word1.replace(/<>/g, '<span class="yuan">');
    word1 = word1.replace(/<\/>/g, "</span>");
    word1 = word1.replace(/< >/g, '<span class="fu">');
    word1 = word1.replace(/<\/ >/g, "</span>");
    word2 = word.replace(/([aeiou])|(?:[^aeiou])y/g, '<span class="aeiouy">$&</span>');
    // word = word.replace(/([aeiou])[^aeiou](e)/g, '<span class="aeiou_e">$&</span>')

    return [word1, word2];
}

async function more(word) {
    if (!word.includes(".")) {
        store.more = store.more || {};
        if (store.more[word]) {
            return store.more[word];
        } else {
            store.dic_key = document.getElementById("dic_key").value;
            if (store.dic_key != "") {
                var res = await fetch(
                    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${store.dic_key}`,
                    {
                        method: "GET",
                    }
                );

                res = await res.json();
                for (i in res) {
                    delete res[i].def;
                }
                store.more[word] = res;
                return res;
            }
        }
    }
}

async function syllable(word, el) {
    if (can_record_p) {
        var syllable_r = await more(word);
        if (syllable_r && syllable_r[0].hwi) {
            var syllable_t = syllable_r[0].hwi.hw;
            var n = 0;
            while (syllable_t.replace(/\*/g, "") != word) {
                syllable_t = syllable_r[0].uros[n].ure;
                n += 1;
            }
            if (el) {
                el.querySelector("#word").innerHTML = w(syllable_t);
            } else {
                return w(syllable_t);
            }
            function w(worddd) {
                worddd = worddd.split("*");
                for (i in worddd) worddd[i] = `<span class="syllable">${worddd[i]}</span>`;
                worddd = worddd.join('<span class="syllable_s"></span>');
                return worddd;
            }
        } else {
            el.querySelector("#word").innerHTML = word;
        }
    }
}

function word_other(word) {
    document.querySelector(`word-card[word="${word}"] #word_other > iframe`).src =
        "https://cn.bing.com/dict/search?q=" + word;
}

setInterval(() => {
    var l = document.querySelectorAll(`word-card #word_other > iframe`);
    for (i in l) {
        l[i].src = '';
    }
}, 5 * 60 * 1000);

document.getElementById("spacing").oninput = () => {
    document.documentElement.style.setProperty("--spacing", `${document.getElementById("spacing").value}em`);
};
