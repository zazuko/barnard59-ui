const Container = require('./Container')

class Jobs extends Container {
  update (contentNode) {
    console.log(contentNode.dataset.toString())

    return super.update(contentNode)
  }
}

module.exports = Jobs
