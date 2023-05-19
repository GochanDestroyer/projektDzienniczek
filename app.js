const nav = document.querySelector(".navigation")
const navElements = Array.from(document.querySelectorAll('.navigation__item'))
const selectTopicElement = document.querySelector("#topic-select")
const selectSectionElement = document.querySelector("#section-select")
const nameField = document.querySelector("#name")
const surnameField = document.querySelector("#surname")
const classField = document.querySelector("#class")
const schoolYearField = document.querySelector("#school-year")
const didInField = document.querySelector("#did-in")
const dateOfStartField = document.querySelector("#date-of-start")
const dateOfEndField = document.querySelector("#date-of-end")
const confirmButton = document.querySelector("#confirm")
const spanName = document.querySelector(".span-name")
const spanSurname = document.querySelector(".span-surname")
const spanClass = document.querySelector(".span-class")
const spanSchoolYear = document.querySelector(".span-school-year")
const spanDidIn = document.querySelector(".span-did-in")
const spanFrom = document.querySelector(".span-from")
const spanTo = document.querySelector(".span-to")
const views = Array.from(document.querySelectorAll(".view"))
const editButton = document.querySelector("#edit")
const hamburgerIcon = document.querySelector(".header__hamburger-icon")
const hamburgerIconElement1 = document.querySelector(".hamburger-icon__element1")
const hamburgerIconElement2 = document.querySelector(".hamburger-icon__element2")
const hamburgerIconElement3 = document.querySelector(".hamburger-icon__element3")
const lessonsDateField = document.querySelector("#lessons-date")
const superviserField = document.querySelectorAll("[name=superviser]")
const reportField = document.querySelector("#report")
const realizedField = document.querySelector("#realized")
const hoursField = document.querySelector("#hours")
const gradeField = document.querySelector("#grade")
const buttonAdd = document.querySelector("#add")
const weatherCity = document.querySelector(".weather-city")
const realizedTopicsList = document.querySelector(".topics")
const summaryTable = document.querySelector(".summary-table")
const toRealizeParagraph = document.querySelector(".to-realize")
const proposedGradeParagraph = document.querySelector(".proposed-grade")
let isMenuClicked = false
let modulesCounter = 0

const apiKey = "2c3c27ce9c0ae1262e7e2f15ba7e3219"
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Gliwice&appid=${apiKey}&units=metric`

const getWeather = async () => {
    const response = await fetch(apiUrl)
    let data = await response.json()
    weatherCity.innerHTML = `Temperatura powietrza dla miasta ${data.name} wynosi ${Math.round(parseInt(data.main.temp))} °C`
}

const printSummary = () => {
    summaryTable.innerHTML = '<tr><th class="table-cell">Nazwa modułu</th><th class="table-cell">Ilość godzin zrealizowanych</th></tr>'
    let hoursSum = 0
    let gradesSum = 0
    let gradesCount = 0
    if (window.localStorage.getItem("lessons") != null) {
        const realizedLessons = JSON.parse(window.localStorage.getItem("lessons"))
        teachingProgram.map((module) => {
            let row = document.createElement("tr")

            let moduleName = document.createElement("td")
            moduleName.innerHTML = module.name
            moduleName.classList.add("table-cell")
            row.appendChild(moduleName)

            const moduleTopics = realizedLessons.filter(
                moduleTopic => moduleTopic.section == module.name
            )
            const moduleHoursSum = moduleTopics.reduce(
                (accumulator, moduleTopic) => accumulator + moduleTopic.hours, 0
            )

            hoursSum += moduleHoursSum
            moduleTopics.map(moduleTopic => {
                gradesSum += moduleTopic.grade
                gradesCount++
            })
            let moduleHours = document.createElement("td")
            moduleHours.innerHTML = moduleHoursSum
            moduleHours.classList.add("table-cell")
            row.appendChild(moduleHours)
            summaryTable.appendChild(row)
        })
    }
    let lastRow = document.createElement("tr")

    let razemText = document.createElement("td")
    razemText.innerHTML = "Razem"
    razemText.classList.add("to-right", "table-cell")
    lastRow.appendChild(razemText)

    let hoursSumCell = document.createElement("td")
    hoursSumCell.innerHTML = hoursSum
    hoursSumCell.classList.add("table-cell")
    lastRow.appendChild(hoursSumCell)
    summaryTable.appendChild(lastRow)

    if (hoursToBeCompleted - hoursSum <= 0) {
        toRealizeParagraph.innerHTML = "Pozostało do zrealizowania: 0 godz."
    } else {
        const toRealize = hoursToBeCompleted - hoursSum
        toRealizeParagraph.innerHTML = `Pozostało do zrealizowania: ${toRealize} godz.`
    }
    let proposedGrade = Math.round(gradesSum / gradesCount)
    if (isNaN(proposedGrade)) {
        proposedGrade = "brak"
    }

    proposedGradeParagraph.innerHTML = `Przewidywana ocena: ${proposedGrade}`
}

const printTopics = () => {
    realizedTopicsList.innerHTML = ""
    if (window.localStorage.getItem("lessons") != null) {
        const lessons = JSON.parse(window.localStorage.getItem("lessons"))
        lessons.forEach((lesson) => {
            let lessonDiv = document.createElement("div")
            lessonDiv.classList.add("realizedTopic")

            let sectionParagraph = document.createElement("p")
            sectionParagraph.innerHTML = `Dział: ${lesson.section}`
            lessonDiv.appendChild(sectionParagraph)

            let topicParagraph = document.createElement("p")
            topicParagraph.innerHTML = `Temat: ${lesson.topic}`
            lessonDiv.appendChild(topicParagraph)

            let thirdLine = document.createElement("p")
            thirdLine.innerHTML = `Opiekun: ${lesson.superviser}, data realizacji: ${lesson.lessonsDate}, ilość godzin: ${lesson.hours}, ocena: ${lesson.grade}`
            lessonDiv.appendChild(thirdLine)

            let reportParagraph = document.createElement("p")
            reportParagraph.innerHTML = `Sprawozdanie: ${lesson.report}`
            lessonDiv.appendChild(reportParagraph)

            realizedTopicsList.appendChild(lessonDiv)
            if (lessons[lessons.length - 1] !== lesson) {
                let line = document.createElement("hr")
                line.classList.add("line")
                realizedTopicsList.appendChild(line)
            }
        })
    }
}

buttonAdd.addEventListener("click", (e) => {
    e.preventDefault()
    let superviser = "brak"
    superviserField.forEach((option) => {
        if (option.checked) {
            superviser = option.value
        }
    })
    const lesson = {
        lessonsDate: logDate(lessonsDateField.value),
        section: selectSectionElement.options[selectSectionElement.selectedIndex].text,
        topic: selectTopicElement.options[selectTopicElement.selectedIndex].text,
        superviser: superviser,
        report: reportField.value,
        realized: realizedField.value,
        hours: parseInt(hoursField.value),
        grade: parseInt(gradeField.value)
    }
    if (window.localStorage.getItem("lessons") != null) {
        let lessons = JSON.parse(window.localStorage.getItem("lessons"))
        lessons.push(lesson)
        window.localStorage.setItem("lessons", JSON.stringify(lessons))
    } else {
        let lessons = [lesson]
        window.localStorage.setItem("lessons", JSON.stringify(lessons))
    }
    printTopics()
    printSummary()
})

window.addEventListener("resize", () => {
    if (window.innerWidth > "900") {
        nav.style.transform = "translate(0, 0)"
    } else if (window.innerWidth < "900") {
        nav.style.transform = "translate(0, -244px)"
    }
})

hamburgerIcon.addEventListener("click", () => {
    if (!isMenuClicked) {
        if (window.innerWidth > "900") {
            nav.style.transform = "translate(0, 0)"
        } else {
            nav.style.transform = "translate(0, -244px)"
        }
        isMenuClicked = true
        hamburgerIconElement1.style.transform = "none"
        hamburgerIconElement2.style.transform = "none"
        hamburgerIconElement3.style.transform = "none"
    } else {
        nav.style.transform = "translate(0, 0)"
        isMenuClicked = false
        hamburgerIconElement1.style.transform = "rotate(-40deg) translate(-5px, -5px)"
        hamburgerIconElement2.style.transform = "rotate(40deg) translate(6px, 15px)"
        hamburgerIconElement3.style.transform = "rotate(40deg) translate(-3.5px, 3.5px)"
    }
})

const logDate = (date) => {
    let dateInDateType = new Date(date)
    let day = String(dateInDateType.getDate())
    if (day >= 1 && day <= 9) {
        day = "0" + day
    }
    let month = String(dateInDateType.getMonth() + 1)
    if (month >= 1 && month <= 9) {
        month = "0" + month
    }
    let year = dateInDateType.getFullYear()

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return "Invalid Date"
    } else {
        dateInDateType = day + "." + month + "." + year
        return dateInDateType
    }
}

const setStudentData = () => {
    if (localStorage.getItem("name") == null || localStorage.getItem("name") == "") {
        spanName.innerHTML = "brak danych"
    } else {
        spanName.innerHTML = localStorage.getItem("name")
    }

    if (localStorage.getItem("surname") == null || localStorage.getItem("surname") == "") {
        spanSurname.innerHTML = "brak danych"
    } else {
        spanSurname.innerHTML = localStorage.getItem("surname")
    }

    if (localStorage.getItem("class") == null || localStorage.getItem("class") == "") {
        spanClass.innerHTML = "brak danych"
    } else {
        spanClass.innerHTML = localStorage.getItem("class")
    }

    if (localStorage.getItem("school-year") == null || localStorage.getItem("school-year") == "") {
        spanSchoolYear.innerHTML = "brak danych"
    } else {
        spanSchoolYear.innerHTML = localStorage.getItem("school-year")
    }

    if (localStorage.getItem("did-in") == null || localStorage.getItem("did-in") == "") {
        spanDidIn.innerHTML = "brak danych"
    } else {
        spanDidIn.innerHTML = localStorage.getItem("did-in")
    }

    if (localStorage.getItem("date-of-start") == "Invalid Date" || localStorage.getItem("date-of-start") == null || localStorage.getItem("date-of-end") == "") {
        spanFrom.innerHTML = "brak danych"
    } else {
        spanFrom.innerHTML = logDate(localStorage.getItem("date-of-start"))
    }

    if (localStorage.getItem("date-of-end") == "Invalid Date" || localStorage.getItem("date-of-end") == null || localStorage.getItem("date-of-end") == "") {
        spanTo.innerHTML = "brak danych"
    } else {
        spanTo.innerHTML = logDate(localStorage.getItem("date-of-end"))
    }
}

let changeView = (viewIndex) => {
    views.forEach((view) => {
        view.style.display = "none"
    })
    views[viewIndex].style.display = "block"
}

navElements.forEach((navElement) => {
    navElement.addEventListener("click", (e) => {
        if (navElements.indexOf(navElement) == 0 && localStorage.getItem("changedViewIndex") != null) {
            changeView(3)
        } else {
            changeView(navElements.indexOf(navElement))
        }
    })
})

confirmButton.addEventListener("click", (e) => {
    e.preventDefault()

    localStorage.setItem("name", nameField.value)
    localStorage.setItem("surname", surnameField.value)
    localStorage.setItem("class", classField.value)
    localStorage.setItem("school-year", schoolYearField.value)
    localStorage.setItem("did-in", didInField.value)
    localStorage.setItem("date-of-start", dateOfStartField.value)
    localStorage.setItem("date-of-end", dateOfEndField.value)

    localStorage.setItem("changedViewIndex", true)
    changeView(3)
    setStudentData()
})

editButton.addEventListener("click", () => {
    nameField.value = localStorage.getItem("name")
    surnameField.value = localStorage.getItem("surname")
    classField.value = localStorage.getItem("class")
    schoolYearField.value = localStorage.getItem("school-year")
    didInField.value = localStorage.getItem("did-in")
    dateOfStartField.value = localStorage.getItem("date-of-start")
    dateOfEndField.value = localStorage.getItem("date-of-end")
    changeView(0)
})

teachingProgram.forEach((module) => {
    let newOptionElement = document.createElement("option")
    newOptionElement.innerHTML = module.name
    newOptionElement.value = modulesCounter
    selectSectionElement.appendChild(newOptionElement)
    modulesCounter++;
})

teachingProgram[0].topics.forEach((topic) => {
    let newOptionElement = document.createElement("option")
    newOptionElement.innerHTML = topic
    selectTopicElement.appendChild(newOptionElement)
})

selectSectionElement.addEventListener("change", (e) => {
    let courrentModuleIndex = selectSectionElement.value
    while (selectTopicElement.lastElementChild) {
        selectTopicElement.removeChild(selectTopicElement.lastElementChild);
    }
    teachingProgram[courrentModuleIndex].topics.forEach((topic) => {
        let newOptionElement = document.createElement("option")
        newOptionElement.innerHTML = topic
        selectTopicElement.appendChild(newOptionElement)
    })
})

getWeather()
if (localStorage.getItem("changedViewIndex") != null) {
    changeView(3)
    setStudentData()
}
printTopics()
printSummary()