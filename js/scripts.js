/* main buttons */

const clearBtn = document.querySelector('.clear-btn')
const calculateBtn = document.querySelector('.calculate-btn')

/* settings */

const settings = document.querySelector('.settings__menu')
const settingsBtn = document.querySelector('.settings-btn')
const settingsBg = document.querySelector('.settings__menu-bg')

/* theme */

const themeBtn = document.querySelector('.theme-btn')
const themeStyle = document.querySelector('html')

/* inputs */

const personOneName = document.querySelector('#personOneName')
const personTwoName = document.querySelector('#personTwoName')
const personOneIncome = document.querySelector('#personOneIncome')
const personTwoIncome = document.querySelector('#personTwoIncome')
const monthlyExpenses = document.querySelector('#monthlyExpenses')

/* advanced inputs */

const billName = document.querySelector('#bill-name')
const billAmount = document.querySelector('#bill-amount')
const billType = document.querySelector('#bill-type')

/* advanced mode */

const advanced = document.querySelector('.app__inputs-advanced')
const advancedBtn = document.querySelector('.advanced-btn')
const addBillBtn = document.querySelector('.add-btn')
const removeBillBtns = document.getElementsByClassName('.remove-btn')
const billsList = document.querySelector('.app__inputs-advanced-bills')

/* results */
const resultsInfo = document.querySelector('.app__results-info')
const resultsInfoBox = document.querySelector('.info-box')
const resultsInfoText = document.querySelector('.info-text')
const resultsInfoBtn = document.querySelector('.info-btn')
const personOneResult = document.querySelector('#personOneResult')
const personTwoResult = document.querySelector('#personTwoResult')
const personOneNameResult = document.querySelector('#personOneNameResult')
const personTwoNameResult = document.querySelector('#personTwoNameResult')
const result = document.querySelector('#result')

/* charts */

const chartsBox = document.querySelector('.app__results-charts')
const canvasContributionChart = document.getElementById('contributionChart')
const canvasAdvancedChart = document.getElementById('advancedChart')

/* global variables */

let arrPersonOne = []
let arrPersonTwo = []
let chartOneContribution
let chartOneAdvanced
let percentPersonOne
let percentPersonTwo

let misc = 0
let rent = 0
let household = 0
let food = 0
let clothing = 0
let transportation = 0
let loans = 0

let sum

/* theme */

const detectSysTheme = () => {
	if (window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
		themeStyle.setAttribute('data-theme', 'dark')
	} else if (window.matchMedia('(prefers-color-scheme: light)').matches === true) {
		themeStyle.setAttribute('data-theme', 'light')
	} else {
		themeStyle.setAttribute('data-theme', 'light')
	}
}

const switchTheme = () => {
	if (themeStyle.getAttribute('data-theme') === 'light') {
		themeStyle.setAttribute('data-theme', 'dark')
		getPercentContribution()
		showCharts()
	} else {
		themeStyle.setAttribute('data-theme', 'light')
		getPercentContribution()
		showCharts()
	}
}

/* advanced calc */

const addNewBill = () => {
	if (checkFields(billName) & (checkNumberFields(billAmount) === true)) {
		const newBill = document.createElement('li')
		newBill.classList.add('bill')
		newBill.innerHTML = `
			<p>${billName.value}</p>
			<p>${billAmount.value}</p>
			<p class="bill-icon"></p>
			<button  class="remove-btn"><i class="fa-solid fa-trash"></i></button>`
		billsList.appendChild(newBill)
		const billIcon = newBill.querySelector('.bill-icon')

		switch (billType.value) {
			case '0':
				newBill.setAttribute('type', 0)
				billIcon.innerHTML = `<i class="fa-solid fa-question"></i>`
				misc += billAmount.valueAsNumber
				break

			case '1':
				newBill.setAttribute('type', 1)
				billIcon.innerHTML = `<i class="fa-solid fa-house"></i>`
				rent += billAmount.valueAsNumber
				break

			case '2':
				newBill.setAttribute('type', 2)
				billIcon.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>`
				household += billAmount.valueAsNumber
				break

			case '3':
				newBill.setAttribute('type', 3)
				billIcon.innerHTML = `<i class="fa-solid fa-utensils"></i>`
				food += billAmount.valueAsNumber
				break

			case '4':
				newBill.setAttribute('type', 4)
				billIcon.innerHTML = `<i class="fa-solid fa-shirt"></i>`
				clothing += billAmount.valueAsNumber
				break

			case '5':
				newBill.setAttribute('type', 5)
				billIcon.innerHTML = `<i class="fa-solid fa-car"></i>`
				transportation += billAmount.valueAsNumber
				break

			case '6':
				newBill.setAttribute('type', 6)
				billIcon.innerHTML = `<i class="fa-solid fa-file-invoice-dollar"></i>`
				loans += billAmount.valueAsNumber
				break

			default:
				break
		}

		billName.value = ''
		billAmount.value = ''
		billType.value = 0

		sumBills()
		getPercentContribution()
		showCharts()
	} else {
		errorPopup()
	}
}

const removeBill = e => {
	if (e.target.matches('.remove-btn') || e.target.matches('.fa-trash')) {
		const billToRemove = e.target.closest('li')
		const amount = parseFloat(billToRemove.children[1].innerText)
		sum -= amount
		switch (billToRemove.getAttribute('type')) {
			case '0':
				misc -= amount
				break

			case '1':
				rent -= amount
				break

			case '2':
				household -= amount
				break

			case '3':
				food -= amount
				break

			case '4':
				clothing -= amount
				break

			case '5':
				transportation -= amount
				break

			case '6':
				loans -= amount
				break

			default:
				break
		}

		billToRemove.remove()
		sumBills()
		getPercentContribution()
		showCharts()
	}
}

const sumBills = () => {
	sum = misc + rent + household + food + clothing + transportation + loans
	monthlyExpenses.value = sum
}

/* main functions */

const getNames = (input, name) => {
	name.value = input.value
}

const checkFields = input => {
	if (input.value === '') {
		input.classList.add('input-error')
	} else {
		input.classList.remove('input-error')
		return true
	}
}

const checkNumberFields = input => {
	if (input.value === '' || input.value <= 0) {
		input.classList.add('input-error')
	} else {
		input.classList.remove('input-error')
		return true
	}
}

const errorPopup = () => {
	let allErrors = document.querySelectorAll('.input-error')
	resultsInfoBox.innerHTML = ''
	if (allErrors.length >= 1) {
		resultsInfo.classList.add('active')
		allErrors.forEach(element => {
			const newElement = document.createElement('p')
			const newElementName = element.previousElementSibling.attributes[0].value
			newElement.textContent = newElementName.replace(/-/g, ' ')
			resultsInfoBox.appendChild(newElement)
		})

		resultsInfoBtn.addEventListener('click', () => {
			resultsInfo.classList.remove('active')
		})
	}
}

const clearAll = () => {
	let allErrors = document.querySelectorAll('.input-error')
	let allInputs = document.querySelectorAll('input')

	allErrors.forEach(element => {
		element.classList.remove('input-error')
	})
	allInputs.forEach(element => {
		element.value = ''
	})
	billType.value = 0
	billsList.innerHTML = ''
	chartOneContribution.destroy()
	chartOneAdvanced.destroy()

	misc = 0
	rent = 0
	household = 0
	food = 0
	clothing = 0
	transportation = 0
	loans = 0

	sum = 0
}

const calculate = (arr, income) => {
	for (let i = 0; i <= 10000; i++) {
		arr[i] = (income * i) / 10000
	}
}

const getFairshare = () => {
	getNames(personOneName, personOneNameResult)
	getNames(personTwoName, personTwoNameResult)
	calculate(arrPersonOne, personOneIncome.value)
	calculate(arrPersonTwo, personTwoIncome.value)
	for (let i = 0; i < arrPersonOne.length; i++) {
		if (
			arrPersonOne[i] + arrPersonTwo[i] >= monthlyExpenses.value &&
			(arrPersonOne[i] * 10000) / personOneIncome.value === (arrPersonTwo[i] * 10000) / personTwoIncome.value
		) {
			personOneResult.value = arrPersonOne[i].toFixed(2)
			personTwoResult.value = arrPersonTwo[i].toFixed(2)
			return (result.value = `${((arrPersonOne[i] * 100) / personOneIncome.value).toFixed(2)}%`)
		} else {
			result.value = 'Not Possible'
			personOneResult.value = ''
			personTwoResult.value = ''
		}
	}
}

/* charts */

const getPercentContribution = () => {
	const total = parseFloat(personOneResult.value) + parseFloat(personTwoResult.value)
	percentPersonOne = (personOneResult.value * 100) / total
	percentPersonTwo = (personTwoResult.value * 100) / total
}

const getPercentType = type => {
	const total = monthlyExpenses.value
	resultPercent = (type * 100) / total
	return resultPercent.toFixed(2)
}

const showCharts = () => {
	Chart.defaults.font.size = 16

	if (themeStyle.getAttribute('data-theme') === 'dark') {
		Chart.defaults.color = '#f1f1f1'
	} else {
		Chart.defaults.color = '#3a3a3a'
	}

	if (chartOneContribution !== undefined) {
		chartOneContribution.destroy()
	}

	if (chartOneAdvanced !== undefined) {
		chartOneAdvanced.destroy()
	}

	if (result.value.slice(0, -1) > 0) {
		chartOneContribution = new Chart(canvasContributionChart, {
			type: 'pie',
			data: {
				labels: [personOneName.value, personTwoName.value],
				datasets: [
					{
						label: 'Amount',
						data: [personOneResult.value, personTwoResult.value],
						borderWidth: 1,
					},
					{
						label: 'Percentage (%)',
						data: [percentPersonOne.toFixed(2), percentPersonTwo.toFixed(2)],
						borderWidth: 2,
					},
				],
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Contribution to the household budget.',
					},
				},
				scales: {},
			},
		})
	}

	if (advanced.classList.contains('active-advanced') && result.value.slice(0, -1) > 0 && sum > 0) {
		chartOneAdvanced = new Chart(canvasAdvancedChart, {
			type: 'pie',
			data: {
				labels: ['Misc.', 'Rent', 'Household', 'Food', 'Clothing', 'Transportation', 'Loans, Other bills'],
				datasets: [
					{
						label: 'Amount',
						data: [misc, rent, household, food, clothing, transportation, loans],
						borderWidth: 1,
					},
					{
						label: 'Percentage (%)',
						data: [
							getPercentType(misc),
							getPercentType(rent),
							getPercentType(household),
							getPercentType(food),
							getPercentType(clothing),
							getPercentType(transportation),
							getPercentType(loans),
						],
						borderWidth: 2,
					},
				],
			},
			options: {
				plugins: {
					title: {
						display: true,
						text: 'Household expenses by the type.',
					},
					legend: {
						position: 'bottom',
						align: 'start',
					},
				},
				scales: {},
			},
		})
	}
}

/* functions and events */

detectSysTheme()
const main = () => {
	if (
		checkFields(personOneName) &
		checkFields(personTwoName) &
		checkNumberFields(personOneIncome) &
		checkNumberFields(personTwoIncome) &
		(checkNumberFields(monthlyExpenses) === true)
	) {
		getFairshare()
		getPercentContribution()
		showCharts()
	} else {
		errorPopup()
	}
}

/* key events */

billAmount.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		addNewBill()
	}
})
monthlyExpenses.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		main()
	}
})

/* settings */

settingsBtn.addEventListener('click', () => {
	settings.classList.toggle('active')
	settingsBg.classList.toggle('active')

	settingsBg.addEventListener('click', e => {
		if (e.target !== settings) {
			settings.classList.remove('active')
			settingsBg.classList.remove('active')
		}
	})
})
themeBtn.addEventListener('click', switchTheme)

/* advanced mode */

advancedBtn.addEventListener('click', () => {
	advanced.classList.toggle('active-advanced')
})
addBillBtn.addEventListener('click', addNewBill)
billsList.addEventListener('click', removeBill)

/* main buttons */

clearBtn.addEventListener('click', clearAll)
calculateBtn.addEventListener('click', main)
