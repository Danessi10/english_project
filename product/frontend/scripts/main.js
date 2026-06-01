const body = document.body;
const menuButton = document.querySelector(".header__menu-button");
const asideMenu = document.querySelector(".aside-menu");
const logoutButton = document.querySelector(".profile-page__logout-button");

const tasksList = document.querySelector(".tasks-page__list");
const taskPopUp = document.querySelector(".tasks-page__format");
const taskTitle = document.querySelector(".tasks-page__format-title");
const taskSelectorsList = document.querySelector(".practice-page__selectors-list");
const toNextChallengeButton = document.querySelector(".practice-page__next-button");

const toLoginButton = document.querySelector(".login-button");
const loginInfo = document.querySelector("#login-info");
const loginForm = document.querySelector("#login-form");
const loginFormTitle = loginForm.querySelector(".login-form__title");
const loginFormNameField = document.getElementById("username");
const loginFormPasswordField = document.getElementById("userpassword");
const loginFormSubmitButton = document.getElementById("login-submit-button");
const loginFormUnderButton = document.getElementById("login-under-button");

const dataList = document.querySelector(".admin-page__data-list");
const settingsList = document.querySelector(".admin-page__settings-list");
const adminBackButton = document.querySelector(".admin-page__back-button");
const adminAddButton = document.querySelector(".admin-page__add-button");
const adminEditor = document.querySelector(".admin-page__editor");

const navLists = document.querySelectorAll(".nav__list");
const navButtons = document.querySelectorAll("[data-target]");
const crossButtons = document.querySelectorAll(".cross-button");

const mainMenuPage = document.querySelector(".main-menu-page");
const learningPage = document.querySelector(".learning-page");
const tasksPage = document.querySelector(".tasks-page");
const profilePage = document.querySelector(".profile-page");
const theoryPage = document.querySelector(".theory-page");
const practicePage = document.querySelector(".practice-page");
const adminPage = document.querySelector(".admin-page");

const pages = {
    "main": mainMenuPage,
    "learning": learningPage,
    "tasks": tasksPage,
    "profile": profilePage,
    "theory": theoryPage,
    "practice": practicePage,
    "admin": adminPage
};

let tasks = {
    1: {
        name: "Семья и друзья",
        paragraph: "Содержимое",
        challenges: {
            1: {
                question: "Мама - ...",
                vars: ["Mother", "Father", "Brother", "Sister", "Cousin"],
                answer: "Mother"
            },
            2: {
                question: "I have two ...",
                vars: ["brother", "sister", "friend", "car", "brothers"],
                answer: "brothers"
            },
            3: {
                question: "... your sister older than you?",
                vars: ["Are", "Do", "Am", "Is", "Be"],
                answer: "Is"
            }
        }
    },
    2: {
        name: "Повседневные предметы и окружение",
        paragraph: "lorem",
        challenges: {
            1: {
                question: "I see a ... on the table",
                vars: ["pen", "cow", "cloud", "zee", "car"],
                answer: "pen"
            },
            2: {
                question: "Do you see that reading man ... the sofa?",
                vars: ["near", "on", "at", "in", "by"],
                answer: "near"
            },
            3: {
                question: "There ... three apples on the table",
                vars: ["are", "is", "am", "be", "do"],
                answer: "are"
            }
        }
    },
    3: {
        name: "Числа и счета",
        paragraph: "lorem",
        challenges: {
            1: {
                question: "thirty nine",
                vars: ["1", "21", "35", "15", "39"],
                answer: "39"
            },
            2: {
                question: "I am ... at the list",
                vars: ["one", "three", "fifth", "seven", "zero"],
                answer: "fifth"
            },
            3: {
                question: "21",
                vars: ["twenty", "thirty", "fifteen", "nine", "twenty one"],
                answer: "3"
            }
        }
    }
};
let shadowTasks = JSON.parse(JSON.stringify(tasks));
let editingTaskName = "";

const users = {
    1: {
        name: "Alex",
        password: "123",
        email: "Alex@gmail.com"
    },
    2: {
        name: "John",
        password: "456",
        email: "John@gmail.com"
    },
    3: {
        name: "Jessy",
        password: "789",
        email: "Jessy@gmail.com"
    }
};

const dataSections = { tasks, users };

const loginFormStates = {
    reg: "registration",
    login: "login"
};

const settingButtonTypes = {
    change: "change",
    delete: "delete",
    add: "add",
    save: "save"
};

let authData = { isLoggedIn: false };

let currentPageName = "main";
let currentTaskKey;
let challengeNum = 1;
let hasFailed = false;
let points = 0;
let currentLoginFormState = loginFormStates.login;
let activeDataListName = "";
let loginTimeout;

function showLogInfo(success, message) {
    if (
        !loginInfo ||
        success === undefined ||
        !message
    ) return;

    loginTimeout && clearTimeout(loginTimeout);
    loginInfo.classList.add("is-active");

    loginTimeout = setTimeout(() => loginInfo.classList.remove("is-active"), 5000);

    loginInfo.textContent = message;
    loginInfo.style.backgroundColor = success ? "green" : "red";
}

function handleLogoutButton() {
    const confirmation = confirm("Вы уверенны, что хотите выйти с аккаунта?");

    if (!confirmation) return;

    if (authData.data.name === "admin") {
        navLists.forEach((list) => {
            const editorButton = list.lastElementChild;
            list.removeChild(editorButton);
        });
    }

    authData = { isLoggedIn: false };
    showLogInfo(true, "Успешный выход из системы");
    togglePage("main");
}

if (logoutButton) {
    logoutButton.addEventListener("click", handleLogoutButton);
}

async function handleLoginFormSubmit(e) {
    e.preventDefault();
    const requestSettings = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: loginFormNameField.value,
            password: loginFormPasswordField.value,
        })
    };

    const response = await fetch(`/${currentLoginFormState}`, requestSettings);
    const result = await response.json();

    if (response.ok && result.success) {
        authData.isLoggedIn = true;
        authData = { ...authData, ...result };
        loginForm.classList.remove("is-active");

        if (authData.data.name === "admin") {
            navLists.forEach((list) => {
                const editorItem = document.createElement("li");
                editorItem.classList.add("nav__item");

                const editorButton = document.createElement("button");
                editorButton.dataset.target = "admin";
                editorButton.type = "button";
                editorButton.classList.add("nav__button");
                editorButton.textContent = "Редактор";
                editorButton.addEventListener("click", handleNavButtonClick);

                editorItem.appendChild(editorButton);
                list.appendChild(editorItem);
            });
        }

        body.classList.remove("unscrolled");
        togglePage(currentPageName, true);
    }

    showLogInfo(result.success, result.message);
}

if (loginForm) {
    loginForm.addEventListener("submit", (e) => handleLoginFormSubmit(e));
}

function handleAdminEditorButtonClick(e) {
    if (!adminEditor) return;

    const button = e.target.closest(".admin-page__editor-practice-button") ||
        e.target.closest(".admin-page__editor-save-button") ||
        e.target.closest(".admin-page__add-button");

    if (!button) return;

    const settingType = button.dataset.settingType;

    if (
        !settingType === settingButtonTypes.delete &&
        !settingType === settingButtonTypes.add &&
        !settingType === settingButtonTypes.save
    ) return;

    const editorContent = adminEditor.querySelector(".admin-page__editor-content");

    if (!editorContent) return;

    if (!editingTaskName) return;

    const taskKey = getDataItemKeyByProp(shadowTasks, "name", editingTaskName);

    if (!taskKey) return;

    const challengesList = adminEditor.querySelector(".admin-page__editor-practice-list");

    if (!challengesList) return;

    const currentShadowTask = shadowTasks[taskKey];

    if (!currentShadowTask) return;

    if (settingType === settingButtonTypes.delete) {
        handleDeleteChallengeButtonClick()
    } else if (settingType === settingButtonTypes.add) {
        handleAddChallengeButtonClick()
    } else if (settingType === settingButtonTypes.save) {
        handleSaveChallengesButtonClick()
    }

    function handleDeleteChallengeButtonClick() {
        const editorPracticeContent = e.target.closest(".admin-page__editor-practice-item__content");

        if (!editorPracticeContent) return;

        const challengeId = editorPracticeContent
            .querySelector(".admin-page__practice-input")
            .id
            .split("practice-content-")[1];
        if (!challengeId) return;

        const challenge = currentShadowTask.challenges[challengeId];

        if (!challenge) return;

        delete shadowTasks[taskKey].challenges[challengeId];
        collectAdminEditor(currentShadowTask)
    }

    function handleAddChallengeButtonClick() {
        const nextChallengeNum = +challengesList.lastElementChild
            ?.querySelector(".admin-page__editor-practice-name").textContent.split(" ")[1] + 1 || 1;

        challengesList.innerHTML += (
            `<li class="admin-page__editor-practice-item">
                <div class="admin-page__editor-practice-item__content">
                    <h5 class="admin-page__editor-practice-name">Задание ${nextChallengeNum}</h5>
                    <ul class="admin-page__editor-practice-steps-list">
                        <li class="admin-page__editor-practice-steps-item">
                            <div
                                class="admin-page__editor-practice-field pop-up__field">
                                <label for="practice-content-${nextChallengeNum}"
                                    class="admin-page__editor-practice-label pop-up__label">
                                    Содержимое
                                </label>
                                <textarea id="practice-content-${nextChallengeNum}" type="text"
                                    class="admin-page__practice-input pop-up__input"></textarea>
                            </div>
                        </li>
                        <li class="admin-page__editor-practice-steps-item">
                            <div
                                class="admin-page__editor-practice-field pop-up__field">
                                <label for="practice-vars-${nextChallengeNum}"
                                    class="admin-page__editor-practice-label pop-up__label">
                                    Варианты ответов
                                </label>
                                <input id="practice-vars-${nextChallengeNum}" type="text"
                                    class="admin-page__practice-input pop-up__input">
                            </div>
                        </li>
                        <li class="admin-page__editor-practice-steps-item">
                            <div
                                class="admin-page__editor-practice-field pop-up__field">
                                <label for="practice-answer-${nextChallengeNum}"
                                    class="admin-page__editor-practice-label pop-up__label">
                                    Верный ответ
                                </label>
                                <input id="practice-answer-${nextChallengeNum}" type="text"
                                    class="admin-page__practice-input pop-up__input">
                            </div>
                        </li>
                    </ul>
                    <button data-setting-type="delete" type="button"
                        class="admin-page__editor-practice-button button button--theme--dark">
                        Удалить
                    </button>
                </div>
            </li>`
        );

        currentShadowTask.challenges[nextChallengeNum] = {
            question: "",
            vars: [],
            answer: ""
        };
    }

    function handleSaveChallengesButtonClick() {
        const hasConfirmed = confirm("Сохранить изменения?");

        if (!hasConfirmed) return;

        tasks = shadowTasks;
        shadowTasks = JSON.parse(JSON.stringify(tasks));
        dataSections.tasks = tasks;

        const activeDataList = dataSections[activeDataListName];
        collectDataList(activeDataList);

        adminEditor.classList.remove("is-active");
    }
}

function handleAdminEditorOnFocusOut(e) {
    const editorContent = adminEditor.querySelector(".admin-page__editor-content");

    if (!editorContent) return;

    if (!editingTaskName) return;

    const taskKey = getDataItemKeyByProp(shadowTasks, "name", editingTaskName);

    if (!taskKey) return;

    const currentShadowTask = shadowTasks[taskKey];

    if (!currentShadowTask) return;

    const input = e.target.closest(".admin-page__editor-input") ||
        e.target.closest(".admin-page__practice-input");

    if (!input) return;

    const inputId = input.id;

    if (!inputId) return;

    let challengeId;

    if (inputId === "editor-task-name") {
        currentShadowTask.name = editingTaskName = input.value;
    } else if (inputId === "theory-content") {
        currentShadowTask.paragraph = input.value;
    } else if (inputId.includes("practice-content-")) {
        challengeId = inputId.split("practice-content-")[1];
        currentShadowTask.challenges[challengeId].question = input.value;
    } else if (inputId.includes("practice-vars-")) {
        challengeId = inputId.split("practice-vars-")[1];
        currentShadowTask.challenges[challengeId].vars = input.value.split(", ");
    } else if (inputId.includes("practice-answer-")) {
        challengeId = inputId.split("practice-answer-")[1];
        currentShadowTask.challenges[challengeId].answer = input.value;
    }
}

if (adminEditor) {
    adminEditor.addEventListener("click", (e) => handleAdminEditorButtonClick(e))
    adminEditor.addEventListener("focusout", (e) => handleAdminEditorOnFocusOut(e))
}

async function handleDataListButtonClick(e) {
    const button = e.target.closest(".admin-page__settings-button");

    if (!button) return;

    const settingTarget = button.dataset.settingTarget;

    if (!settingTarget) return;

    // const requestSettings = {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // };

    // const response = await fetch(`/${settingTarget}`, requestSettings);
    // const result = await response.json();

    // if (!result) return;

    activeDataListName = settingTarget;

    const data = dataSections[activeDataListName];

    collectDataList(data);

    dataList.classList.remove("is-hidden");
    adminBackButton.classList.remove("is-hidden");
    settingTarget !== "users" && adminAddButton.classList.remove("is-hidden");
    settingsList.classList.add("is-hidden");
}

if (settingsList) {
    settingsList.addEventListener("click", (e) => handleDataListButtonClick(e))
}

function handleAdminAddButtonClick() {
    const nextTaskKey = Object.keys(tasks).length + 1;
    const newTaskName = "Новая тема";
    const newTask = shadowTasks[nextTaskKey] = {
        name: newTaskName,
        paragraph: "",
        challenges: {
            1: {
                question: "",
                vars: [],
                answer: ""
            }
        }
    };

    editingTaskName = newTaskName;

    collectAdminEditor(newTask)
    adminEditor.classList.add("is-active")
}

if (adminAddButton) {
    adminAddButton.addEventListener("click", handleAdminAddButtonClick)
}

function handleAdminBackButtonClick() {
    settingsList.classList.remove("is-hidden")
    dataList.classList.add("is-hidden")
    adminBackButton.classList.add("is-hidden")
    adminAddButton.classList.add("is-hidden")
}

if (adminBackButton) {
    adminBackButton.addEventListener("click", handleAdminBackButtonClick);
}

function deleteData(dataList, fieldName) {
    const hasConfirmed = confirm(`Вы уверенны, что хотите удалить поле ${fieldName}?`);

    if (!hasConfirmed) return;

    dataList[fieldName] && delete dataList[fieldName];
}

function handleSettingButtonClick(e) {
    if (!activeDataListName) return;

    const settingButton = e.target.closest(".admin-page__data-item-editor-button");
    const settingType = settingButton.dataset.settingType;

    if (!settingButton || !settingType) return;

    editingTaskName = e.target.closest(".admin-page__data-item-content").firstElementChild.textContent;
    const activeDataList = dataSections[activeDataListName];

    if (!editingTaskName) return;

    if (settingType === "delete") {
        const hasConfirmed = confirm("После удаления тема не подлежит восстановлению!");

        if (!hasConfirmed) return;

        for (const key in activeDataList) {

            if (activeDataList[key].name === editingTaskName) {
                delete activeDataList[key];
                break;
            }
        }

        collectDataList(activeDataList)

    } else if (settingType === "change") {
        if (!adminEditor) return;

        const taskKey = getDataItemKeyByProp(activeDataList, "name", editingTaskName);
        const task = activeDataList[taskKey];

        collectAdminEditor(task)
        adminEditor.classList.add("is-active");
        body.classList.add("unscrolled");
    }
}

if (dataList) {
    dataList.addEventListener("click", (e) => handleSettingButtonClick(e));
}

function handleToNextChallengeButtonClick() {
    hasFailed = false;

    const task = tasks[currentTaskKey];
    const challenges = task.challenges;
    const challengesLength = Object.keys(challenges).length;

    if (!challenges[challengeNum + 1]) {
        let count = 0;

        for (let key = challengeNum + 2; count <= challengesLength; key++) {

            if (challenges[key]) {
                challengeNum = key;
                break;
            }

            count++;
        }
    } else {
        challengeNum++;
    }

    collectPracticePage()
    toNextChallengeButton.classList.remove("is-active");
}

if (toNextChallengeButton) {
    toNextChallengeButton.addEventListener("click", handleToNextChallengeButtonClick);
}

function handleToLoginButtonClick() {
    if (
        !authData ||
        !loginForm ||
        loginForm.classList.contains("is-active")
    ) {
        return
    };

    if (authData.isLoggedIn) {
        togglePage("profile");
    } else {
        loginForm.classList.add("is-active");
        body.classList.add("unscrolled");
    }
}

if (toLoginButton) {
    toLoginButton.addEventListener("click", handleToLoginButtonClick)
}

function handleUnderButtonClick() {
    loginForm.classList.remove("is-active");

    setTimeout(() => {
        updateLoginFormState()
        loginForm.classList.add("is-active");
    })
}

if (loginFormUnderButton) {
    loginFormUnderButton.addEventListener("click", handleUnderButtonClick)
}

function handleMenuButtonClick() {
    if (!asideMenu) return;

    if (asideMenu.classList.contains("is-active")) {
        asideMenu.classList.add("out")

        setTimeout(() => {
            asideMenu.classList.remove("out")
            asideMenu.classList.remove("is-active")
            body.classList.remove("unscrolled")
        }, 500)

    } else {
        asideMenu.classList.add("is-active")
        body.classList.add("unscrolled")
    }
}

if (menuButton) {
    menuButton.addEventListener("click", handleMenuButtonClick)
}

function handleNavButtonClick(e) {
    const nextPageName = e.target.dataset.target;
    if (!nextPageName) return;

    togglePage(nextPageName);
}

if (navButtons && navButtons.length) {
    navButtons.forEach(button => {
        button.addEventListener("click", (e) => handleNavButtonClick(e))
    })
}

function handleCrossButtonClick(e) {
    const popUp = e.target.closest(".pop-up");

    if (!popUp) return;

    e.target.closest(".admin-page__editor") && (shadowTasks = JSON.parse(JSON.stringify(tasks)));
    popUp.classList.remove("is-active");
    body.classList.remove("unscrolled");
}

if (crossButtons && crossButtons.length) {
    crossButtons.forEach(button => {
        button.addEventListener("click", (e) => handleCrossButtonClick(e))
    })
}

function handleTaskButtonClick(e) {
    if (!taskTitle) return;

    const taskButton = e.target.closest(".tasks-page__button");

    if (!taskButton) return;

    currentTaskKey = taskButton.dataset.taskNum || null;

    if (!currentTaskKey) return;

    const taskName = tasks[currentTaskKey].name;

    if (!taskName) return;

    taskTitle.textContent = taskName;
    taskPopUp.classList.add("is-active");
}

if (tasksList) {
    tasksList.addEventListener("click", (e) => handleTaskButtonClick(e))
}

function handleSelectorButtonClick(e) {
    const selectorButton = e.target.closest(".practice-page__selector");

    if (!selectorButton) return;

    const task = tasks[currentTaskKey];

    if (!task) return;

    const challenges = task.challenges;

    if (!challenges) return;

    const currentChallenge = challenges[challengeNum];

    if (!currentChallenge) return;

    const userAnswer = selectorButton.textContent;
    const correctAnswer = currentChallenge.answer;

    if (!(correctAnswer === userAnswer)) {
        selectorButton.style.backgroundColor = "red";
        hasFailed = true;
    } else {
        toNextChallengeButton.classList.add("is-active");
        selectorButton.style.backgroundColor = "green";
        !hasFailed && points++;

        if (challengeNum === +Object.keys(challenges).at(-1)) {
            challengeNum = 1;
            togglePage("tasks");
        }
    }
}

if (taskSelectorsList) {
    taskSelectorsList.addEventListener("click", (e) => handleSelectorButtonClick(e))
}

function collectDataList(data) {
    if (
        !data ||
        !(typeof data === "object")
    ) return;

    const shouldChangeButtonBe = (activeDataListName !== "users");
    let result = "";

    for (const item in data) {
        let name = data[item].name;

        if (!name) {
            name = "<Пусто>"
        }

        result += (
            `<li class="admin-page__data-item">
                <div class="admin-page__data-item-content">
                    <h3 class="admin-page__data-item-name">${name}</h3>
                    <ul class="admin-page__data-item-editors-list">
                        <li class="admin-page__data-item-editor-item">
                                        <button type="button" data-setting-type="delete" class="admin-page__data-item-editor-button button button--theme--dark">Удалить</button>
                        </li>
                        ${shouldChangeButtonBe ? `<li class="admin-page__data-item-editor-item">
                                        <button type="button" data-setting-type="change" class="admin-page__data-item-editor-button button button--theme--dark">Изменить</button>
                        </li>` : ""}
                    </ul>
                </div>
            </li>`
        );
    }

    dataList.innerHTML = result;
}

function collectTasksButtons() {
    let result = "";

    for (const taskNum in tasks) {
        const task = tasks[taskNum];

        result += (
            `<li class="tasks-page__list-item">
                <button data-task-num=${taskNum} aria-label="Открыть тему" class="tasks-page__button button">
                    <h5 class="tasks-page__task-name">${task.name}</h5>
                </button>
            </li>`
        );
    }

    tasksList.innerHTML = result;
}

function collectTheoryPage() {
    const paragraph = theoryPage.querySelector(".paragraph");
    paragraph.textContent = tasks[currentTaskKey].paragraph;
}

function collectPracticePage() {
    const task = tasks[currentTaskKey];

    if (!task) return;

    const challenges = task.challenges;

    if (!challenges) return;

    !challenges[challengeNum] && (challengeNum = +Object.keys(challenges)[0])

    const currentChallenge = challenges[challengeNum];

    if (!currentChallenge) return;

    const challengeText = currentChallenge.question || "";
    const vars = currentChallenge.vars || "";

    const challengeContainer = practicePage.querySelector(".practice-page__challenge");
    const taskSelectorsList = practicePage.querySelector(".practice-page__selectors-list");
    const toTheoryButton = practicePage.querySelector(".practice-page__button");

    let selectorsHTML = "";

    for (const variation of vars) {
        selectorsHTML += (
            `<li class="practice-page__selectors-list-item">
                <button type="button" class="practice-page__selector button button--theme--dark">${variation}</button>
            </li>`
        );
    }

    challengeContainer.textContent = challengeText;
    taskSelectorsList.innerHTML = selectorsHTML;
    toTheoryButton.textContent = `Теория: ${task.name}`;
}

function collectProfilePage() {
    if (!profilePage) return;

    if (
        !authData || !authData.isLoggedIn
    ) return;

    const userName = authData.data.name;
    const userNameField = profilePage.querySelector(".profile-page__username");

    userNameField.textContent = userName;
}

function collectAdminEditor(task) {
    const {
        name,
        paragraph,
        challenges
    } = task;

    const challengesList = document.querySelector(".admin-page__editor-practice-list");

    if (!challengesList) return;

    const nameField = adminEditor.querySelector("#editor-task-name");
    const paragraphField = adminEditor.querySelector("#theory-content");

    if (!nameField || !paragraphField) return;

    nameField.value = name;
    paragraphField.value = paragraph;

    let challengesListHTML = "";
    let count = 1;

    for (const key in challenges) {
        const challenge = challenges[key];

        challengesListHTML += (
            `<li class="admin-page__editor-practice-item">
                <div class="admin-page__editor-practice-item__content">
                    <h5 class="admin-page__editor-practice-name">Задание ${count}</h5>
                    <ul class="admin-page__editor-practice-steps-list">
                        <li class="admin-page__editor-practice-steps-item">
                            <div
                                class="admin-page__editor-practice-field pop-up__field">
                                <label for="practice-content-${key}"
                                    class="admin-page__editor-practice-label pop-up__label">
                                    Содержимое
                                </label>
                                <textarea id="practice-content-${key}" type="text"
                                    class="admin-page__practice-input pop-up__input">${challenge.question || ""}</textarea>
                            </div>
                        </li>
                        <li class="admin-page__editor-practice-steps-item">
                            <div
                                class="admin-page__editor-practice-field pop-up__field">
                                <label for="practice-vars-${key}"
                                    class="admin-page__editor-practice-label pop-up__label">
                                    Варианты ответов
                                </label>
                                <input id="practice-vars-${key}" value="${challenge.vars?.join(', ') || ""}" type="text"
                                    class="admin-page__practice-input pop-up__input">
                            </div>
                        </li>
                        <li class="admin-page__editor-practice-steps-item">
                            <div
                                class="admin-page__editor-practice-field pop-up__field">
                                <label for="practice-answer-${key}"
                                    class="admin-page__editor-practice-label pop-up__label">
                                    Верный ответ
                                </label>
                                <input id="practice-answer-${key}" value="${challenge.answer || ""}" type="text"
                                    class="admin-page__practice-input pop-up__input">
                            </div>
                        </li>
                    </ul>
                    <button data-setting-type="delete" type="button"
                        class="admin-page__editor-practice-button button button--theme--dark">
                        Удалить
                    </button>
                </div>
            </li>`
        );

        count++;
    }

    challengesList.innerHTML = challengesListHTML;
}

function updateLoginFormState() {
    if (currentLoginFormState === loginFormStates.login) {
        currentLoginFormState = loginFormStates.reg;

        loginFormTitle && (loginFormTitle.textContent = "Регистрация");
        loginFormNameField && (loginFormNameField.placeholder = "Придумайте имя");
        loginFormPasswordField && (loginFormPasswordField.placeholder = "Придумайте пароль");
        loginFormSubmitButton && (loginFormSubmitButton.textContent = "Зарегистрироваться");
        loginFormUnderButton && (loginFormUnderButton.textContent = "Уже есть аккаунт?");
        loginForm && (loginForm.action = "/reg")
    } else if (currentLoginFormState === loginFormStates.reg) {
        currentLoginFormState = loginFormStates.login;

        loginFormTitle && (loginFormTitle.textContent = "Вход");
        loginFormNameField && (loginFormNameField.placeholder = "Введите имя");
        loginFormPasswordField && (loginFormPasswordField.placeholder = "Введите пароль");
        loginFormSubmitButton && (loginFormSubmitButton.textContent = "Войти");
        loginFormUnderButton && (loginFormUnderButton.textContent = "Зарегистрироваться");
    }

    loginForm && (loginForm.action = `/${currentLoginFormState}`);
}

function togglePage(nextPageName, strictReload = false) {
    if (
        !currentPageName ||
        !nextPageName ||
        !pages
    ) return;

    const currentPage = pages[currentPageName];
    const nextPage = pages[nextPageName];

    if (
        !currentPage ||
        !nextPage
    ) return;

    if (
        currentPageName === nextPageName &&
        !strictReload
    ) return;

    asideMenu.classList.remove("is-active");

    if (nextPageName === "tasks" && !tasksList.children.length) {
        collectTasksButtons();
    }

    if (nextPageName === "theory" || nextPageName === "practice") {
        taskPopUp.classList.remove("is-active");

        const title = nextPage.querySelector(".title");
        title && (title.textContent = tasks[currentTaskKey].name);

        if (nextPageName === "theory") {
            collectTheoryPage()
        }

        if (nextPageName === "practice") {
            collectPracticePage()
        }
    }

    if (nextPageName === "profile") {

        if (!authData.isLoggedIn) {
            loginForm.classList.add("is-active");
            return;
        }

        collectProfilePage();
    }

    if (currentPageName === "practice") {
        toNextChallengeButton.classList.remove("is-active");
        hasFailed = false;
    }

    body.classList.remove("anim");

    setTimeout(() => {
        currentPageName = nextPageName;
        body.classList.add("anim");
        currentPage.classList.remove("is-active");
        nextPage.classList.add("is-active");
    });
}

function getDataItemKeyByProp(obj, prop, value) {
    for (const item in obj) {
        const element = obj[item];

        if (element[prop] === value) {
            return item;
        }
    }

    return null;
}