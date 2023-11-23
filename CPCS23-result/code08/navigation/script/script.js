function sectionNav () {
    const sectionNavMap = new Map();
    const sections = document.querySelectorAll('.section_wrap section');
    const nav = document.querySelector('.section_nav');
    
    const navLinks = nav.querySelectorAll('.section_nav a');
    const navLinkBg = nav.querySelector('.section_nav span.active_bg');

    let lastSection = ''
    let winY = window.scrollY

    for (const section of sections) {
        sectionNavMap.set(section.id, document.querySelector(`.section_nav a[href="#${section.id}"]`));
    }

    const sumPrevSiblingsWidths = function(element) {
        let sum = 0;
        let prev = element.previousElementSibling;
        while(prev) {
          sum += prev.offsetWidth;
          prev = prev.previousElementSibling;
        }
        return sum;
    }

    function moveBg(navEl) {
        //1-1. bg크기를 a링크의 영역에 맞게 세팅
        navLinkBg.style.width = `${navEl.offsetWidth}px`

        //2. 해당 a랭크가 X축을 구해서 left 값 세팅
        let left = sumPrevSiblingsWidths(navEl)
        navLinkBg.style.left = `${left}px`
    }

    function onChange(currentSection) {
        if (currentSection != lastSection) { //ID값이 달라지면 실행 (중복실행 방지)
            const currentNavLink = sectionNavMap.get(currentSection.id);

            navLinks.forEach(link => link.classList.remove('active'));
            currentNavLink.classList.add('active');

            moveBg(currentNavLink) 
        }
        lastSection = currentSection
    }

    sections.forEach(section => {
        window.addEventListener('scroll', function () {
            winY = window.scrollY

            const currentSection = [...sections].reverse().find(section => winY + 1 > window.pageYOffset + section.getBoundingClientRect().top);
            if (currentSection === undefined) {
                return
            }

            onChange(currentSection)
        })

    })        
}

window.addEventListener('DOMContentLoaded', function () {
    sectionNav ()
})
