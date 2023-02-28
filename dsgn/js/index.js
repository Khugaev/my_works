$(function () {

  function changeNewsTitlesHeight() {
    let indexMaxHeight = 0

    let countOfNewsRows = Math.trunc(newsTitles.length / 2)

    for (let j = 0; j < countOfNewsRows; j++) {
      for (let i = j * 2; i < j * 2 + 2; i++) {
        if (newsTitles[i].clientHeight > newsTitles[indexMaxHeight].clientHeight) {
          indexMaxHeight = i
        }
      }

      for (let i = j * 2; i < j * 2 + 2; i++) {
        if (i !== indexMaxHeight) {
          newsTitles[i].style.marginBottom = `${$(newsTitles[indexMaxHeight]).height() - $(newsTitles[i]).height()}px`
        }
      }
    }
  }

  let newsTitles = $('.news__item-title')

  const onNewsTitlesHeight = new ResizeObserver(entries => {
      changeNewsTitlesHeight(newsTitles)
    }
  )

  for (let i = 0; i < newsTitles.length; i++) {
    onNewsTitlesHeight.observe(newsTitles[i])
  }

  function headerRightSideToggle() {
    const windowInnerWidth = window.innerWidth
    if (windowInnerWidth < 641) {
      const burger = $('.burger')
      const headerInfo = $('.header__info')

      burger.insertAfter('.header__intro')
      headerInfo.hide()
    } else {
      const burger = $('.burger')
      const headerInfo = $('.header__info')
      headerInfo.show()
      burger.insertAfter('.header__contacts')
    }
  }

  function deleteProjectsContainers() {
    const windowInnerWidth = window.innerWidth
    if (windowInnerWidth < 961 && !deleteProjectsContainers.removeFlag) {
      $('.projects__card-4').insertAfter('.projects__card-2')
      $('.projects__card-3').insertAfter('.projects__card-2')
      $('.projects__card-8').insertAfter('.projects__card-6')
      $('.projects__card-7').insertAfter('.projects__card-6')

      $('.projects__cards--3-4').hide()
      $('.projects__cards--7-8').hide()

      deleteProjectsContainers.removeFlag = true

    } else if (windowInnerWidth >= 961 && deleteProjectsContainers.removeFlag) {
      $('.projects__cards--3-4').append($('.projects__card-3'))
      $('.projects__cards--3-4').append($('.projects__card-4'))
      $('.projects__cards--7-8').append($('.projects__card-7'))
      $('.projects__cards--7-8').append($('.projects__card-8'))

      $('.projects__cards--3-4').show()
      $('.projects__cards--7-8').show()

      deleteProjectsContainers.removeFlag = false
    }
  }

  function ReplaceAwardsToBottom() {
    const windowInnerWidth = window.innerWidth
    if (windowInnerWidth < 1025 && !deleteProjectsContainers.replaceFlag) {
      $('.studio__right-text').insertAfter('.studio__content')
      deleteProjectsContainers.replaceFlag = true
    } else if (windowInnerWidth >= 1025 && deleteProjectsContainers.replaceFlag) {
      $('.studio__right-text').insertAfter('.studio__left-text')
      deleteProjectsContainers.replaceFlag = false
    }
  }

  headerRightSideToggle()
  deleteProjectsContainers.removeFlag = false
  deleteProjectsContainers()
  deleteProjectsContainers.replaceFlag = false
  ReplaceAwardsToBottom()

  $(window).on('resize', headerRightSideToggle)
  $(window).on('resize', deleteProjectsContainers)
  $(window).on('resize', ReplaceAwardsToBottom)


  let headerElements = $('.header__intro-box').children()
  let projectsCards = $('.projects__card, .projects__main, .projects__timeline');
  let studioBlocks = $('.studio__main, .studio__content');
  let staffPerson = $('.staff__person')
  let newsBlocks = $('.news__main, .news__list')
  let footerElements = $('.footer__content-right').children().add($('.footer__map'))


  let options = {
    rootMargin: '0px',
    threshold: 0
  }

  let callback = function (entries) {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('_active')
      }
    })
  };

  let observer = new IntersectionObserver(callback, options);

  projectsCards.each((index, element) => {
    observer.observe(element)
  })
  headerElements.each((index, element) => {
    observer.observe(element)
  })
  studioBlocks.each((index, element) => {
    observer.observe(element)
  })
  staffPerson.each((index, element) => {
    observer.observe(element)
  })
  newsBlocks.each((index, element) => {
    observer.observe(element)
  })
  footerElements.each((index, element) => {
    observer.observe(element)
  })
})
