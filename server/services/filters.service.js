const getSortItems = async (Model) => {
    const item = await Model.find().select('-_id');
    return item
}

module.exports = getSortItems;