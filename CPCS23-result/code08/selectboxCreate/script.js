/*리스트 동적 생성*/
function createDropdown() {
	// '.form-cont select' 선택자로 모든 select 요소를 찾아 selects 변수에 할당
	const selects = document.querySelectorAll('.form-cont select')

	// 찾은 각 select 요소에 대해 반복
	selects.forEach((select) => {
		// select 요소의 옵션, 필수 여부, 버튼 스타일을 객체로 구성
		const elParams = {
			options: select.querySelectorAll('option'),  // 현재 select 요소의 모든 option 태그
			required: select.hasAttribute('required') ? 'required' : '', // select가 'required' 속성을 가지고 있는지 확인
			btnStyle: select.classList.length > 0 ? select.classList : 'btn-drop-box', // select에 클래스가 있으면 사용하고, 없으면 기본 클래스명 사용
		}

		// makeList 함수를 호출하여 드롭다운 목록 생성
		const list = makeList(elParams)

		// 생성된 드롭다운 목록을 select 요소 다음에 삽입
		select.insertAdjacentHTML('afterend', list)
	})
}

// 드롭다운 목록을 만드는 함수 정의
function makeList({ options, required, btnStyle }) {
	let optionTexts = [] // 옵션 텍스트를 저장할 배열
	let selectedOptionText = '' // selected 가 있는(선택된) 옵션의 텍스트
	let isHiddenSelected = false // hidden 속성이 있는 옵션이 있는지의 여부
	
	// options 배열을 순회하며 각 옵션 처리
	for (let option of options) {
		if (option.selected) {
			selectedOptionText = option.innerText // selected 가 있는(선택된) 옵션의 텍스트 저장
			if (option.hidden) {
				isHiddenSelected = true // 선택된 옵션이 숨겨져 있으면 true로 설정
			}
		}

		// hidden 속성이 있는 옵션은 반복문 종료하여 배열에 담지않음
		if (option.hidden) {
			continue
		}

		// 숨겨진 옵션을 제외하고 나머지의 텍스트와 값을 optionTexts 배열에 저장
		optionTexts.push({ text: option.innerText, value: option.value })
	}

	/* 각 옵션을 사용하여 LI가 될 HTML 문자열 생성 */
	// 1. optionTexts 배열의 각 요소 ({ text, value })를 순회함
	// 2. 각 요소에 대해 HTML 문자열을 반환
	// 3. 만들어진 배열의 모든 요소를 연결하여 단일 문자열로 결합 (join)
	const listItems = optionTexts.map(({ text, value }) => {
		const isSelected = text === selectedOptionText ? "active" : "" // 현재 옵션이 선택된 상태인지 확인하여 active 클래스 세팅여부 체크
		return `<li class="${isSelected}"><a href="#" data-value="${value}">${text}</a></li>`
	}).join('')

	//버튼 컨텐츠 생성
	const buttonContent = isHiddenSelected ? `<span ${`class="${required}"`}>${selectedOptionText}</span>` : selectedOptionText
	
	// 드롭다운 전체 HTML 구조 생성
	const createDropdown = `
		<div class="form-drop-box">
			<button type="button" class="${btnStyle}" data-event="dropdown">
				${buttonContent}
			</button>
			<ul class="drop-list">
				${listItems}
			</ul>
		</div>
	`

	// 생성된 드롭다운 HTML 반환
	return createDropdown
}

/*이벤트 위임 동작*/
function dropdownList() {
	function setDropdownEvent(target) {
		const parentElement = target.closest('.form-drop-box')
		const value = target.dataset.value //데이터 속성에서 선택된 value 를 가져옴

		/*active 클래스 세팅 */
		const allLinks = Array.from(parentElement.querySelectorAll('a'))
		const otherLinks = allLinks.filter(a => a !== target) //현재 선택된 링크를 제외한 다른 모든 링크를 필터링

		//otherLinks에 담긴 배열을 순회하며 active 클래스 제거 및 target에 클래스 추가
		for (let i = 0; i < otherLinks.length; i++) {
			otherLinks[i].classList.remove('active')
		}
		target.classList.add('active')

		/*list 닫기*/
		const firstButton = parentElement.querySelector('.btn-drop-box, .btn-drop-line')
		openEvent(firstButton, false)
		

		 //만약 부모 요소가 .form-cont 클래스를 가지고 있다면(select option 세팅도 해야하기에), selectSet 함수를 호출
		if (parentElement.parentElement.classList.contains('form-cont')) selectSet(parentElement, value)
		changedText(parentElement, target) /*버튼 텍스트 교체*/
	}

	//list - open / close & class set
	function openEvent(target, isOpen) {
		var parent = target.parentElement
		var list = ''

		if (parent.classList.contains('form-drop-box')) {
			list = parent.querySelector('.drop-list')
		} else if(parent.tagName === 'LI') {
			list = parent.querySelector('ul')
		}

        if (isOpen) {
            target.classList.add('open')
            // $(list).slideDown()
            list.style.display = 'block'
        } else {
            target.classList.remove('open')
            // $(list).slideUp()
            list.style.display = 'none'
		}
	}

	//select tag update
	function selectSet(el, value) {
		//dropdown 메뉴와 연결된 <select>요소 찾아옴
		const targetSelect = el.parentElement.querySelector('select')

		if (value === 'select-clear') {
			Array.from(targetSelect.options).forEach(option => {
				option.removeAttribute('selected')
				option.selected = false
			})
			targetSelect.value = ''  // select 요소의 값 초기화
		} else {
			const changeOption = targetSelect.querySelector(`option[value="${value}"]`)
	
			if (changeOption) {
				Array.from(targetSelect.options).forEach(option => {
					option.removeAttribute('selected')
					option.selected = false
				})
				changeOption.setAttribute('selected', 'selected')
				changeOption.selected = true
			}
		}
	}

	function listDropdown(target) {
		const parentElement = target.parentElement
		let open = target.classList.contains('open') ? true : false
		!open ? openEvent(target, true) : openEvent(target, false)
	}

	//text 변경 함수
	function changedText(parentElement, target) {
		const btnElement = parentElement.querySelector('[data-event="dropdown"]')
		// const labelElement = btnElement.querySelector('span')

		let valueText = target.innerText
		btnElement.innerText = valueText
	}

	function init() {
		document.addEventListener('click', function (event) {

			if (event.target.getAttribute('data-event') === 'dropdown') {
				listDropdown(event.target)
			}

			if (event.target.tagName === 'A' && event.target.closest('.drop-list')) {
				event.preventDefault()
				setDropdownEvent(event.target)
			}
		})
	}
	init()
}

document.addEventListener('DOMContentLoaded', () => {
    createDropdown()
    dropdownList()
})