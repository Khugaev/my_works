// $(function () {
//     let intro = $("#intro");
//     let header = $("#header")
//     let introH = intro.innerHeight();
//     let headerH = header.innerHeight();
//
//     headerScroll();
//
//     $(window).on("scroll resize", function () {
//         headerScroll()
//     });
//
//     function headerScroll () {
//         introH = intro.innerHeight();
//         headerH = header.innerHeight();
//
//         let scrollTop = $(this).scrollTop();
//         if (scrollTop >= introH - headerH){
//             $("#header").addClass("header--dark");
//         }
//         else {
//             $("#header").removeClass("header--dark");
//         }
//     }
//
//     /* Video */
//
//     let videoButton = document.querySelector('#video_button');
//     let videoBlock = document.querySelector('.video-block');
//     console.dir(videoBlock)
//     let videoForInsertion = `<iframe class="youtube-video" width=\"${videoBlock.clientWidth}\" height=\"${videoBlock.clientHeight}\" src=\"https://www.youtube.com/embed/hdA03p6egdg\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>`
//     videoButton.addEventListener('click', () => {
//         videoBlock.innerHTML =videoForInsertion
//     })
//
//     /* Modal */
//
//     let modal = document.querySelector('.modal')
//     modal.addEventListener('click', () =>{
//         modal.classList.add('hide')
//     })
//
//     let modal_content = document.querySelector('.modal__container')
//     modal_content.addEventListener('click', (e) =>{
//         e.stopPropagation();
//     })
// })
//


const modal = $.modal()