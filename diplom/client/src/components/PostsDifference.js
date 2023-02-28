import React from 'react';
import {Col, Row} from "react-bootstrap";
import Parser from "html-react-parser";
import {switchBlockType} from "../utils/tools";


function highlightBlockChanges(previousPostBlocks, newPostBlocks) {
  let postConvertedHtml = "";
  const lines = {}

  let lastMatch = 0

  for (let i = 0; i < previousPostBlocks.length; i++) {
    for (let j = lastMatch; j < newPostBlocks.length; j++) {
      if (previousPostBlocks[i].type === newPostBlocks[j].type) {
        let equal = true
        let k = 0
        switch (previousPostBlocks[i].type) {
          case 'image':
            if (newPostBlocks[j].data.file.url === previousPostBlocks[i].data.file.url) {
              lines[i + 1] = j + 1
              lastMatch = j
            }
            break
          case 'paragraph' :
            if (newPostBlocks[j].data.text === previousPostBlocks[i].data.text) {
              lines[i + 1] = j + 1
              lastMatch = j
            }
            break
          case "header":
            if (newPostBlocks[j].data.text === previousPostBlocks[i].data.text) {
              lines[i + 1] = j + 1
              lastMatch = j
            }
            break;
          case "checklist":
            equal = true
            k = 0
            while (equal && k < previousPostBlocks[i].data.items.length) {
              equal = newPostBlocks[j].data.items[k].text === previousPostBlocks[i].data.items[k].text &&
                newPostBlocks[j].data.items[k].checked === previousPostBlocks[i].data.items[k].checked
              k++
            }
            if (equal) {
              lines[i + 1] = j + 1
              lastMatch = j
            }
            break;
          case "embed":
            break;
          case "delimiter":
            lines[i + 1] = j + 1
            lastMatch = j
            break;
          case "table":
            equal = previousPostBlocks[i].data.withHeadings === newPostBlocks[j].data.withHeadings
            k = 0
            let l
            while (equal && k < previousPostBlocks[i].data.content.length) {
              l = 0
              while (equal && l < previousPostBlocks[i].data.content[k].length) {
                equal = newPostBlocks[j].data.content[k][l] === previousPostBlocks[i].data.content[k][l]
                l++
              }
              k++
            }
            if (equal) {
              lines[i + 1] = j + 1
              lastMatch = j
            }
            break;
          case "list":
            equal = previousPostBlocks[i].data.style === newPostBlocks[j].data.style
            k = 0
            while (equal && k < previousPostBlocks[i].data.items.length) {
              equal = newPostBlocks[j].data.items[k] === previousPostBlocks[i].data.items[k]
              k++
            }
            if (equal) {
              lines[i + 1] = j + 1
              lastMatch = j
            }
            break;
        }
      }
    }
  }
  const keys = Object.keys(lines)

  let firstCol = 1
  let secondCol = 1
  let positionDifference = 0

  let prevIndex = 1
  let nextIndex = 1

  while (firstCol <= previousPostBlocks.length || secondCol <= newPostBlocks.length) {
    let i = firstCol - 1
    console.log(keys[i], lines[i + 1], i + 1)
    if (lines[i + 1]) { // если есть пара( та же строка)
      console.log(lines[i + 1] - (i + 1))
      let nearestFirstColMatch = i + 1
      while ((previousPostBlocks.length >= nearestFirstColMatch) && !lines[nearestFirstColMatch]) nearestFirstColMatch++
      const end = lines[nearestFirstColMatch] ? lines[nearestFirstColMatch] : newPostBlocks.length + 1
      if (firstCol === nearestFirstColMatch) {
        while (secondCol !== end) {
          postConvertedHtml +=
            `<tr>
              <td></td>
              <td>${nextIndex}</td>
              <td>${switchBlockType(newPostBlocks[secondCol-1], 'added')}</td>
            </tr>`
          positionDifference++
          secondCol++
          nextIndex++
        }
      }
      postConvertedHtml += `<tr>
              <td>${prevIndex}</td>
              <td>${nextIndex}</td>
              <td>${switchBlockType(previousPostBlocks[i], '')}</td>
            </tr>`

      firstCol++
      secondCol++
      nextIndex++
      prevIndex++
    } else {
      let nearestFirstColMatch = i + 1
      while ((previousPostBlocks.length >= nearestFirstColMatch) && !lines[nearestFirstColMatch]) nearestFirstColMatch++
      const end = lines[nearestFirstColMatch] ? lines[nearestFirstColMatch] : newPostBlocks.length + 1
      positionDifference = end - nearestFirstColMatch
      if (secondCol === end) {
        while (firstCol !== nearestFirstColMatch) {
          postConvertedHtml += `<tr>
              <td>${prevIndex}</td>
              <td></td>
              <td>${switchBlockType(previousPostBlocks[firstCol-1], 'deleted')}</td>
            </tr>`


          positionDifference--
          firstCol++
          prevIndex++
        }
      } else {
        let changeStart
        let changeEnd
        let deleteOrAddEnd
        let deleteOrAddBlocks
        let blockClass
        if (nearestFirstColMatch - firstCol < end - secondCol) {
          changeStart = secondCol - 1 + (nearestFirstColMatch - firstCol)
          changeEnd = secondCol - 1 + (nearestFirstColMatch - firstCol)
          deleteOrAddEnd = end - 1
          deleteOrAddBlocks = newPostBlocks
          blockClass = 'added'
        } else {
          changeStart = end - 1
          changeEnd = firstCol + (end - secondCol) - 1
          deleteOrAddEnd = nearestFirstColMatch - 1
          deleteOrAddBlocks = previousPostBlocks
          blockClass = 'deleted'
        }
        let firstColPointer = firstCol - 1
        for (let j = secondCol - 1; j < changeStart; j++) {
          postConvertedHtml += `<tr>
              <td>${prevIndex}</td>
              <td></td>
              <td>${switchBlockType(previousPostBlocks[firstColPointer++], 'prev', newPostBlocks[j])}</td>
            </tr>`
          prevIndex++

        }
        firstColPointer = firstCol - 1
        for (let j = secondCol - 1; j < changeStart; j++) {
          postConvertedHtml += `<tr>
              <td></td>
              <td>${nextIndex}</td>
              <td>${switchBlockType(newPostBlocks[j], 'new', previousPostBlocks[firstColPointer++])}</td>
            </tr>`
          nextIndex++
        }
        for (let j = changeEnd; j < deleteOrAddEnd; j++) {
          if (blockClass === "deleted") {
            postConvertedHtml += `<tr>
              <td>${prevIndex++}</td>
              <td></td>
              <td>${switchBlockType(deleteOrAddBlocks[j], blockClass)}</td>
            </tr>`
          } else {
            postConvertedHtml += `<tr>
              <td></td>
              <td>${nextIndex++}</td>
              <td>${switchBlockType(deleteOrAddBlocks[j], blockClass)}</td>
            </tr>`
          }
        }
        secondCol = end
        firstCol = nearestFirstColMatch
      }
    }
  }
  return postConvertedHtml
}


const PostsDifference = ({previousPostBlocks, newPostBlocks}) => {
  return (
    <Row>
      <Col md={8}>
        <table>
          <tbody>
            {Parser(highlightBlockChanges(previousPostBlocks, newPostBlocks))}
          </tbody>
        </table>
      </Col>
    </Row>
  );
};

export default PostsDifference;
