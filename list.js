let list = [];
let filteredList = [];
let key = "list";
let filter = {
    lastBought: "All",
    selected: "All",
    bought: "All",
    frequency: "All",
    type: "All",
    category: "All",
    name: ""
};
let yesNoOptions = ["Yes", "No"];

let ddlSort = document.getElementById("ddlSort");
let ddlTypesFilter = document.getElementById("ddlTypesFilter");
let ddlCategoriesFilter = document.getElementById("ddlCategoriesFilter");
let ddlFrequenciesFilter = document.getElementById("ddlFrequenciesFilter");
let ddlSelectedFilter = document.getElementById("ddlSelectedFilter");
let ddlBoughtFilter = document.getElementById("ddlBoughtFilter");
let ddlLastBoughtFilter = document.getElementById("ddlLastBoughtFilter");
let dvItems = document.getElementById("dvItems");
let dvList = document.getElementById("dvList");
let dvListAction = document.getElementById("dvListAction");
let dvDetailAction = document.getElementById("dvDetailAction");
let dvDetail = document.getElementById("dvDetail");
let btnAdd = document.getElementById("btnAdd");
let btnBack = document.getElementById("btnBack");
let btnNext = document.getElementById("btnNext");
let btnPrevious = document.getElementById("btnPrevious");
let btnSave = document.getElementById("btnSave");
let btnExport = document.getElementById("btnExport");
let btnBackup = document.getElementById("btnBackup");
let btnRestore = document.getElementById("btnRestore");
let ddlTypes = document.getElementById("ddlTypes");
let ddlFrequencies = document.getElementById("ddlFrequencies");
let cbSelected = document.getElementById("cbSelected");
let cbBought = document.getElementById("cbBought");
let dvCategories = document.getElementById("dvCategories");
let tbId = document.getElementById("tbId");
let tbName = document.getElementById("tbName");
let tbComment = document.getElementById("tbComment");
let tbQuantity = document.getElementById("tbQuantity");
let fileRestore = document.getElementById("fileRestore");
let btnDelete = document.getElementById("btnDelete");
let btnClear = document.getElementById("btnClear");

let editItem = {};

window.addEventListener("load", (event) => {
    initialize();
});

function initialize() {
    restore();
    filterList();
    bindList();
    bindDdls();
    show(dvDetail, false);
    show(dvDetailAction, false);
    show(fileRestore, false);

    ddlSort.addEventListener("change", () => {
        sort(ddlSort.value);
    });
    ddlTypesFilter.addEventListener("change", () => {
        setFilter("type", ddlTypesFilter.value);
    });
    ddlCategoriesFilter.addEventListener("change", () => {
        setFilter("category", ddlCategoriesFilter.value);
    });
    ddlFrequenciesFilter.addEventListener("change", () => {
        setFilter("frequency", ddlFrequenciesFilter.value);
    });
    ddlSelectedFilter.addEventListener("change", () => {
        setFilter("selected", ddlSelectedFilter.value);
    });
    ddlBoughtFilter.addEventListener("change", () => {
        setFilter("bought", ddlBoughtFilter.value);
    });
    ddlLastBoughtFilter.addEventListener("change", () => {
        setFilter("lastBought", ddlLastBoughtFilter.value);
    });

    btnAdd.addEventListener("click", () => {
        open(getNewItem());
        show(dvList, false);
        show(dvListAction, false);
        show(dvDetail, true);
        show(dvDetailAction, true);
        show(btnPrevious, false);
        show(btnNext, false);
    });

    btnBack.addEventListener("click", () => {
        navigate(0);
    });

    btnSave.addEventListener("click", () => {
        update();
    });

    btnDelete.addEventListener("click", () => {
        removeItem();
    });

    btnClear.addEventListener("click", () => {
        clear();
    });

    btnPrevious.addEventListener("click", () => {
        navigate(-1);
    });

    btnNext.addEventListener("click", () => {
        navigate(1);
    });

    btnExport.addEventListener("click", () => {
        exportToFile();
    });

    btnBackup.addEventListener("click", () => {
        backupToFile();
    });

    btnRestore.addEventListener("click", () => {
        fileRestore.click();
    });

    fileRestore.addEventListener("change", () => {
        restoreFromFile();
    });
}

function show(element, visibile) {
    element.style.display = visibile ? "block" : "none";
}

function bindDdls() {
    ["Created", "Name", "Type", "Frequency", "Selected", "Bought"].forEach(type => {
        ddlSort.options[ddlSort.options.length] = new Option(type, type == "Created" ? "id" : type.toLowerCase());
    });

    getTypes().forEach(type => {
        ddlTypes.options[ddlTypes.options.length] = new Option(type, type);
    });

    getFrequencies().forEach(type => {
        ddlFrequencies.options[ddlFrequencies.options.length] = new Option(type, type);
    });

    ddlTypesFilter.options[ddlTypesFilter.options.length] = new Option("All", "All");
    getTypes().forEach(type => {
        ddlTypesFilter.options[ddlTypesFilter.options.length] = new Option(type, type);
    });

    ddlCategoriesFilter.options[ddlCategoriesFilter.options.length] = new Option("All", "All");
    getCategories().forEach(type => {
        ddlCategoriesFilter.options[ddlCategoriesFilter.options.length] = new Option(type, type);
    });

    ddlFrequenciesFilter.options[ddlFrequenciesFilter.options.length] = new Option("All", "All");
    getFrequencies().forEach(type => {
        ddlFrequenciesFilter.options[ddlFrequenciesFilter.options.length] = new Option(type, type);
    });

    ddlSelectedFilter.options[ddlSelectedFilter.options.length] = new Option("All", "All");
    yesNoOptions.forEach(type => {
        ddlSelectedFilter.options[ddlSelectedFilter.options.length] = new Option(type, type);
    });

    ddlBoughtFilter.options[ddlBoughtFilter.options.length] = new Option("All", "All");
    yesNoOptions.forEach(type => {
        ddlBoughtFilter.options[ddlBoughtFilter.options.length] = new Option(type, type);
    });

    ddlLastBoughtFilter.options[ddlLastBoughtFilter.options.length] = new Option("All", "All");
    yesNoOptions.forEach(type => {
        ddlLastBoughtFilter.options[ddlLastBoughtFilter.options.length] = new Option(type, type);
    });

    bindCategories([]);
}

function bindCategories(categories) {
    dvCategories.innerText = "";
    getCategories().forEach(category => {
        let cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("id", "cb" + category);
        cb.checked = categories.includes(category);

        let lb = document.createElement("label");
        lb.htmlFor = cb.id;
        lb.appendChild(document.createTextNode(category));

        dvCategories.appendChild(cb);
        dvCategories.appendChild(lb);
    });
}

function bindList() {
    dvItems.innerText = "";
    filteredList.forEach(item => {
        let dv = document.createElement('div');
        dv.id = "dvItem" + item.Id;

        let cb = document.createElement('input');
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("itemId", item.Id);
        cb.id = "cbSelected" + item.Id;
        cb.checked = item.Buy;
        // tb.addEventListener("click", function () { saveItem(this); });
        dv.appendChild(cb);

        let spn = document.createElement("span");
        spn.setAttribute("itemId", item.Id);
        spn.id = "tbName" + item.Id;
        spn.innerText = item.name + " (" + item.comment + ") - " + item.quantity;
        spn.addEventListener("click", () => {
            show(btnPrevious, true);
            show(btnNext, true);
            open(item);
        });
        dv.appendChild(spn);

        dvItems.appendChild(dv);
    });
}

function sort(field) {
    filteredList.sort((a, b) => {
        return a[field].toString().localeCompare(b[field].toString());
    });
    bindList();
}

function update() {
    editItem.name = tbName.value;
    editItem.comment = tbComment.value;
    editItem.quantity = tbQuantity.value;
    editItem.type = ddlTypes.options[ddlTypes.selectedIndex].value;
    editItem.frequency = ddlFrequencies.options[ddlFrequencies.selectedIndex].value;
    editItem.selected = cbSelected.checked;
    editItem.bought = cbBought.checked;
    editItem.categories = [];
    getCategories().forEach(category => {
        if (document.getElementById("cb" + category).checked) {
            editItem.categories.push(category);
        }
    });

    if (editItem.id == -1) {
        addItem(editItem);
    }

    save();
}

function open(item) {
    editItem = item;
    tbId.value = editItem.id;
    tbName.value = editItem.name;
    tbComment.value = editItem.comment;
    tbQuantity.value = editItem.quantity;
    ddlTypes.value = editItem.type;
    ddlFrequencies.value = editItem.frequency;
    cbSelected.checked = editItem.selected;
    cbBought.checked = editItem.bought;
    bindCategories(editItem.categories);

    show(dvList, false);
    show(dvListAction, false);
    show(dvDetail, true);
    show(dvDetailAction, true);
}

function getNewItem() {
    return {
        id: -1,
        name: "",
        comment: "",
        quantity: "",
        type: "Grocery",
        categories: ["Monthly"],
        frequency: "Regular",
        lastBought: false,
        selected: false,
        bought: false
    };
}

function addItem(item) {
    let ids = list.map(listItem => listItem.id);
    item.id = (ids.length > 0 ? Math.max(...ids) : 0) + 1;
    list.push(item);
    filterList();
}

function removeItem() {
    let index = list.findIndex(listItem => listItem.id == editItem.id);
    if (index >= 0) {
        list.splice(index, 1);
        save();
        filterList();
    }

    navigate(0);
}

function clear() {
    list = [];
    save();
    filterList();
    bindList();
}

function navigate(step) {
    let index = filteredList.findIndex(item => item.id == editItem.id);
    if (step == -1 && index > 0) {
        editItem = filteredList[index - 1];
        open(editItem);
    } else if (step == 1 && index < filteredList.length - 1) {
        editItem = filteredList[index + 1];
        open(editItem);
    } else if (step == 0) {
        show(dvList, true);
        show(dvListAction, true);
        show(dvDetail, false);
        show(dvDetailAction, false);
        filterList();
        bindList();
    }
}

function getTypes() {
    return ["Stationary", "Grocery", "Cosmetic", "Cleaning", "Snack"];
}

function getCategories() {
    return ["Monthly", "Pongal", "Diwali", "Chathurthi", "Pooja", "Karthigai"];
}

function getFrequencies() {
    return ["Frequent", "Regular", "Often", "Rare", "Never"];
}

function filterList() {
    filteredList = list.filter(item => (filter.lastBought == "All" || item.lastBought == (filter.lastBought == "Yes")) &&
        (filter.selected == "All" || item.selected == (filter.selected == "Yes")) &&
        (filter.bought == "All" || item.bought == (filter.bought == "Yes")) &&
        (filter.frequency == "All" || item.frequency == filter.frequency) &&
        (filter.type == "All" || item.type == filter.type) &&
        (filter.category == "All" || item.categories.includes(filter.category)) &&
        (filter.name == "" || item.name.toLowerCase().indexOf(filter.name.toLowerCase()) >= 0));
}

function setFilter(key, value) {
    filter[key] = value;
    filterList();
    bindList();
}

function restoreFromFile() {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var importedData = JSON.parse(event.target.result);
        list = [];
        for (i = 0; i < importedData.length; i++) {
            importedData[i].id = i + 1;
            list.push(importedData[i]);
        }

        save();
        filterList();
        bindList();
        fileRestore.value = "";
    };
    fileReader.readAsText(fileRestore.files[0], "UTF-8");
}

function exportToFile() {
    let data = "";
    list.forEach(item => {
        let entry = item.name;
        entry += item.comment ? " (" + item.comment + ")" : "";
        entry += item.quantity ? " - " + item.quantity : "";
        data += entry + "\r\n";
    });

    saveAsFile(data, "List " + getFormattedDate());
}

function backupToFile() {
    saveAsFile(JSON.stringify(list), "ListBackup_" + getFormattedDate());
}

function saveAsFile(data, fileName) {
    let a = document.createElement("a");
    a.download = fileName;
    a.innerHTML = "export";
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));
    a.style.display = "none";
    a.onclick = function (event) { document.body.removeChild(event.target); };
    document.body.appendChild(a);
    a.click();
}

function getFormattedDate() {
    var d = new Date();
    d = d.getFullYear()
        + ('0' + (d.getMonth() + 1)).slice(-2)
        + ('0' + d.getDate()).slice(-2)
        + ('0' + d.getHours()).slice(-2)
        + ('0' + d.getMinutes()).slice(-2)
        + ('0' + d.getSeconds()).slice(-2);
    return d;
}

function save() {
    localStorage.setItem(key, JSON.stringify(list));
}

function restore() {
    var items = JSON.parse(localStorage.getItem(key));
    list = items ? items : [];
}
