export const changeArr = (arr) => {
    const rootId = arr.filter(el => el.root).id
    const createTree = (items, id) => {
        const children = [];
        items.forEach(item => {
            if (item.parentId === id) {
                children.push({
                    ...item,
                    children: createTree(items, item.id)
                })
            }
        })
        return children;
    }
    const tree = createTree(arr, rootId);
    return tree;
}

export const findParentsId = (arr, id) => {
    const parentsId = [];
    const findId = (items, i) => {
        items.forEach(item => {
            if (item.id === i) {
                parentsId.push(item.id)
                if (item.parentId) {
                    findId(arr, item.parentId)
                }
            } else if (item.children) {
                findId(item.children, i)
            }
        })
    }
    findId(arr, id);
    return parentsId;
}

export const findElement = (arr, id, result) => {

    return arr.reduce((res, item) => {
        if (res) {
            return res;
        }
        if (item.id == id) {
            return item;
        }
        return findElement(item.children, id);
    }, result);


}

export const findNotes = (arr, searchName) => {

    searchName = searchName.trim()

    return arr.reduce((res, item) => {
        if (item.title.trim() === searchName || item.tags.some(el => el.trim() === searchName)) {

            res.push(item)
        }
        return res;
    }, [])


}





