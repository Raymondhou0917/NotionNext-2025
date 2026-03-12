import { checkStrIsUuid, isIterable } from '@/lib/utils'

export function getPageContentText(post, pageBlockMap) {
  function getText(targetObj) {
    if (!targetObj) {
      return ''
    }
    const textArray = targetObj.title || targetObj.caption
    return getTextArray(textArray)
  }

  function getTextArray(textArray) {
    const text = textArray ? getTextContent(textArray) : ''
    if (text && text !== 'Untitled') {
      return text
    }
    return ''
  }

  const removeTypeFlag = ['a', 'p', '‣']

  function getTextContent(textArray) {
    if (typeof textArray === 'object' && isIterable(textArray)) {
      let result = ''
      for (const textObj of textArray) {
        if (textArray.length > 1 && removeTypeFlag.includes(textArray[0])) {
          return result
        }
        result += getTextContent(textObj)
      }
      return result
    }

    if (typeof textArray === 'string') {
      if (checkStrIsUuid(textArray) && pageBlockMap.block[textArray]) {
        return getBlockContentText(textArray)
      }
      if (textArray === pageBlockMap.block[postId]?.value?.space_id) {
        return ''
      }
      return textArray
    }

    return ''
  }

  function getTransclusionReference(block) {
    const result = []
    const blockPointerId = block?.format?.transclusion_reference_pointer?.id
    if (blockPointerId && pageBlockMap.block[blockPointerId]?.value?.content) {
      for (const blockContent of pageBlockMap.block[blockPointerId].value.content) {
        result.push(getBlockContentText(blockContent))
      }
    }
    return result.join('')
  }

  function getBlockContentText(id) {
    const block = pageBlockMap?.block?.[id]?.value
    const blockType = block?.type
    switch (blockType) {
      case 'transclusion_reference':
        return getTransclusionReference(block)
      case 'table':
        return getTableText(block.content || [])
      case 'page':
        if (id !== postId) {
          return getText(block.properties)
        }
        return ''
      case 'breadcrumb':
      case 'divider':
        return ''
      default:
        return getText(block?.properties)
    }
  }

  function getTableText(tableRowIds) {
    const result = []
    for (const blockRowId of tableRowIds) {
      if (pageBlockMap.block[blockRowId]) {
        const blockRow = pageBlockMap.block[blockRowId].value
        const blockRowProperties = blockRow.properties || {}
        for (const blockRowPropertyValue of Object.values(blockRowProperties)) {
          result.push(getTextArray(blockRowPropertyValue))
        }
      }
    }
    return result.join('')
  }

  const postId = post.id
  const contentTextList = []
  if (pageBlockMap?.block && !post.password) {
    for (const id of Object.keys(pageBlockMap.block)) {
      const blockContentText = getBlockContentText(id)
      if (blockContentText) {
        contentTextList.push(blockContentText)
      }
    }
  }
  return contentTextList.join('')
}
