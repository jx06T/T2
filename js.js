let action = "POST"
let json = {}
let headers = {}
let logs = []
json = JSON.stringify(json)
let url = 'https://script.google.com/macros/s/AKfycbyIWJjYbXMIy4VTbRevmaB_RZHVXv_jrJUtvVW2sIwdCK2NhR40y5fvezxDXFpzKQA9Yg/exec'

function uplog(logs, n, t) {
    let html = `<Ftr>
    <th>name</th>
    <th>time</th>
    <th>type</th>
    <th>content</th>
</tr>`
    for (let i = 0; i < logs.length; i++) {
        if ((n != "" && n != logs[i]["name"]) || (t != logs[i]["type"] && t != "")) continue
        html +=
            `<tr>
    <td>${logs[i]['name']}</td>
    <td>${logs[i]['time']}</td>
    <td>${logs[i]['type']}</td>
    <td>${logs[i]['content']}</td>
</tr>`
    }
    document.getElementById("LogTable").innerHTML = html
}

function update(data) {
    logs = []
    for (let i = 0; i < data["log"].length; i++) {
        if (data["log"][i]['time'] === "$$$") break
        logs.push(data["log"][i])
    }
    uplog(logs, FilterByName.value, FilterByType.value)
    //上線
    html = ""
    html = "<option value='test' class='machine'>testsssssssssssssss</option>"
    if (data["onlinePC"].includes(PC.value)) html = `<option value="${PC.value}" class="machine">${PC.value}</option>`
    for (let i = 0; i < data["onlinePC"].length; i++) {
        if (data["onlinePC"][i] == PC.value) continue
        html +=
            `<option value="${data["onlinePC"][i]}" class="machine">${data["onlinePC"][i]}</option>`
    }
    document.getElementById("onlineer").innerHTML = html

}

let getJSON = async (url, body) => {
    let response = await fetch(url, { method: action, headers: headers, body: body });
    let JSONa = await response.json();
    update(JSONa)
}

document.getElementById("cmd").onclick = () => send("cmd({%})", cmd.value.split('\n'))
document.getElementById("msg").onclick = () => send("msg({%})", [msg.value])
document.getElementById("order").onclick = () => send(order1.value, [order2.value])
document.getElementById("updata").onclick = () => { getJSON(url, JSON.stringify({ "type": "controller", "PC": "log##", })); getJSON(url, JSON.stringify({ "type": "controller", "PC": "log##", })) }
const cmd = document.getElementById("cmdv");
const msg = document.getElementById("msgv");
const order1 = document.getElementById("orders");
const order2 = document.getElementById("orderv");
const PC = document.getElementById("onlineer");
const FilterByName = document.getElementById("FilterByName");
const FilterByType = document.getElementById("FilterByType");
document.getElementById("FilterByName").onchange = () => uplog(logs, FilterByName.value, FilterByType.value)
document.getElementById("FilterByType").onchange = () => uplog(logs, FilterByName.value, FilterByType.value)
function send(m, data) {
    if (data == "" || (PC.value == "")) return
    let datas = []
    for (let i = 0; i < data.length; i++) {
        d = data[i]
        if (!m.includes("=")) {
            if (d.includes("#{")) {
                d = "'" + d.replace("#{", "\',")
            } else {
                d = "'" + d + "'"
            }
        }
        datas.push(m.replace("{%}", d.replaceAll("\n", "#n#")))
    }

    json = JSON.stringify({
        "type": "controller",
        "PC": PC.value,
        "data": datas,
    })
    document.getElementById("success").innerText = datas
    getJSON(url, json)
}
getJSON(url, JSON.stringify({ "type": "controller", "PC": "log##", }))

setInterval(function () {
    getJSON(url, JSON.stringify({ "type": "controller", "PC": "log##", }))
    // getJSON(url, JSON.stringify({ "type": "controller", "PC": "log##", }))
}, 5000);