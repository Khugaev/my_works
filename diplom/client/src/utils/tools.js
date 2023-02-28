import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'

const highlightedChanges = (previousText, newText, classAdd = '') => {
    const wordsPrev = previousText.split(' ')
    const wordsNew = newText.split(' ')

    const wordsNewTemp = wordsNew.slice(0)
    const line = wordsPrev.map(w => {
        const wordIndexInNew = wordsNewTemp.indexOf(w)
        // если это слово не изменено
        if (wordIndexInNew !== -1) {
            wordsNewTemp.splice(wordIndexInNew, 1)
            return w
        } else {
            return `<span class="changed">${w}</span>`
        }
    }).join(' ')
    return line
}


export const switchBlockType = (block, classAdd='', nextBlock = null) => {
    let convertedHtml = ''
    switch (block.type) {
        case "header":
            return `<h${block.data.level} class="ce-header ${classAdd}">${block.data.text}</h${block.data.level}>`;
        case "checklist":
            convertedHtml += `<div class="cdx-block cdx-checklist ${classAdd}">`;
            block.data.items.forEach((input, index) => {
                convertedHtml += `<div class="cdx-checklist__item${input.checked ? ' cdx-checklist__item--checked' : ''}">
<span class="cdx-checklist__item-checkbox"></span>
<div class="cdx-checklist__item-text">${input.text}</div>
</div>`;
            })
            convertedHtml += '</div>';
            return convertedHtml
        case "embed":
            return`<div class=${classAdd}><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
        case "paragraph":
            /*if (classAdd === 'prev') {
                if (nextBlock.type === "paragraph") {
                    return highlightedChanges(block, nextBlock, classAdd)
                }
            } else if (classAdd === 'new') {
                if (nextBlock.type === "paragraph") {
                    return highlightedChanges(nextBlock, block, classAdd)
                }*/
            if (classAdd === 'prev' || classAdd === 'new') {
                if (nextBlock.type === "paragraph") {
                    return `<p class="cdx-block ${classAdd}">
                        ${highlightedChanges(block.data.text, nextBlock.data.text, classAdd)}
                    </p>`
                }
            } else {
                return `<p class="cdx-block ${classAdd}">${block.data.text}</p>`;
            }
            break
        case "delimiter":
            return `<div class="ce-delimiter ${classAdd}"></div>`;
        case "image":
            if (classAdd === 'prev' || classAdd === 'new') {
                if (nextBlock.type === "image") {
                    return `<p class="cdx-block ${classAdd}">${block.data.file.url}</p>`;
                }
            } else {
                return `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" />
<br /><em>${block.data.caption}</em>`;
            }
            break
        case "table":
            if (classAdd === 'prev' || classAdd === 'new') {
                if (nextBlock.type === "table") {
                    convertedHtml += `<table class="${classAdd}">` //tc-row tc-cell
                    let i = 0
                    if (block.data.withHeadings) {
                        convertedHtml += '<th>'
                        block.data.content[i].forEach(cell => {
                            convertedHtml += `<td>${cell}</td>`
                        })
                        convertedHtml += '</th>'
                        i++
                    }
                    for (; i < block.data.content.length; i++) {
                        convertedHtml += '<tr>'
                        block.data.content[i].forEach(cell => {
                            convertedHtml += `<td>${cell}</td>`
                        })
                        convertedHtml += '</tr>'
                    }
                    convertedHtml += '</table>'
                    return convertedHtml
                    return highlightedChanges(block, nextBlock, classAdd)
                }
            } else {
                convertedHtml += `<table class="${classAdd}">` //tc-row tc-cell
                let i = 0
                if (block.data.withHeadings) {
                    convertedHtml += '<th>'
                    block.data.content[i].forEach(cell => {
                        convertedHtml += `<td>${cell}</td>`
                    })
                    convertedHtml += '</th>'
                    i++
                }
                for (; i < block.data.content.length; i++) {
                    convertedHtml += '<tr>'
                    block.data.content[i].forEach(cell => {
                        convertedHtml += `<td>${cell}</td>`
                    })
                    convertedHtml += '</tr>'
                }
                convertedHtml += '</table>'
                return convertedHtml
            }

        case "list":
            if (block.data.style === 'ordered') {
                convertedHtml += `<ol class="cdx-list cdx-list--ordered ${classAdd}">`;
            }
            else {
                convertedHtml += `<ul class="cdx-list cdx-list--unordered ${classAdd}">`;
            }

            block.data.items.forEach(function (li) {
                convertedHtml += `<li class="cdx-list__item">${li}</li>`;
            });
            if (block.data.style === 'ordered') {
                convertedHtml += "</ol>";
            }
            else {
                convertedHtml += "</ul>";
            }
            return convertedHtml
        default:
            console.log("Unknown block type", block.type);
            break;
    }
}

export const EDITOR_JS_TOOLS = {
    // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
    // paragraph: Paragraph,
    embed: Embed,
    table: Table,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: {
        class: LinkTool,
        config: {
            endpoint: 'http://localhost:5003/upload/image/', /*'http://localhost:8008/fetchUrl',*/ // Your backend endpoint for url data fetching
        }
    },
    image: {
        class: Image,
        config: {
            endpoints: {
                byFile: 'http://localhost:5003/upload/image', // Your backend file uploader endpoint
                byUrl: 'http://localhost:5003/upload/image/byUrl', // Your endpoint that provides uploading by Url
            }
        }
    },
    raw: Raw,
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage,
}

export function convertDataToHtml(blocks) {
    let convertedHtml = "";
    blocks.map(block => {
        convertedHtml += switchBlockType(block)
    });
    return convertedHtml;
}


/*switch (block.type) {
            case "header":
                convertedHtml += `<h${block.data.level} class="ce-header">${block.data.text}</h${block.data.level}>`;
                break;
            case "checklist":
                convertedHtml += '<div class="cdx-block cdx-checklist">';
                block.data.items.forEach((input, index) => {
                    convertedHtml += `<div class="cdx-checklist__item${input.checked ? ' cdx-checklist__item--checked' : ''}">
<span class="cdx-checklist__item-checkbox"></span>
<div class="cdx-checklist__item-text">${input.text}</div>
</div>`;
                })
                convertedHtml += '</div>';
                break;
            case "embed":
                convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
                break;
            case "paragraph":
                convertedHtml += `<p class="cdx-block">${block.data.text}</p>`;
                break;
            case "delimiter":
                convertedHtml += "<div class='ce-delimiter'></div>";
                break;
            case "image":
                convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
                break;
            case "table":
                convertedHtml += '<table>' //tc-row tc-cell
                let i = 0
                if (block.data.withHeadings) {
                    convertedHtml += '<th>'
                    block.data.content[i].forEach(cell => {
                        convertedHtml += `<td>${cell}</td>`
                    })
                    convertedHtml += '</th>'
                    i++
                }
                for (; i < block.data.content.length; i++) {
                    convertedHtml += '<tr>'
                    block.data.content[i].forEach(cell => {
                        convertedHtml += `<td>${cell}</td>`
                    })
                    convertedHtml += '</tr>'
                }
                convertedHtml += '</table>'
                break;
            case "list":
                if (block.data.style === 'ordered') {
                    convertedHtml += "<ol class='cdx-list cdx-list--ordered'>";
                }
                else {
                    convertedHtml += "<ul class='cdx-list cdx-list--unordered'>";
                }

                block.data.items.forEach(function (li) {
                    convertedHtml += `<li class="cdx-list__item">${li}</li>`;
                });
                if (block.data.style === 'ordered') {
                    convertedHtml += "</ol>";
                }
                else {
                    convertedHtml += "</ul>";
                }
                break;
            default:
                console.log("Unknown block type", block.type);
                break;
        }*/