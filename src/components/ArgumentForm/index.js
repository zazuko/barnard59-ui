import Vue from 'vue/dist/vue.js'
import FormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import Form from 'bootstrap-vue/es/components/form/form'
import FormInput from 'bootstrap-vue/es/components/form-input/form-input'
import Button from 'bootstrap-vue/es/components/button/button'
import Table from 'bootstrap-vue/es/components/table/table'
import Select from 'bootstrap-vue/es/components/form-select/form-select'

const types = {
  'p:variableName': {
    text: 'Variable'
  },
  'code:EcmaScriptTemplateLiteral': {
    text: 'ES6 template literal'
  },
  'code:EcmaScript': {
    text: 'EcmaScript'
  }
}

export default Vue.component('argument-form', {
  props: [
    'step'
  ],
  components: {
    'b-table': Table,
    'b-select': Select,
    'b-button': Button,
    'b-form': Form,
    'b-form-input': FormInput,
    'b-form-group': FormGroup
  },
  data: () => ({
    types,
    fields: [ 'index', 'value', 'actions' ],
    editedFields: []
  }),
  computed: {
    items: function () {
      if (!this.step) return []

      return this.step['code:arguments'].map((arg, index) => ({
        index: index + 1,
        ...arg,
        _showDetails: this.editedFields.includes(index)
      }))
    }
  },
  methods: {
    saveArgument: function (evt, row) {
      this.endEditing(
        evt,
        row.index,
        row.item,
        this.step['code:arguments'][row.index])
    },
    revertArgument: function (evt, row) {
      this.endEditing(
        evt,
        row.index,
        this.step['code:arguments'][row.index],
        row.item)
    },
    addArgument: function () {
      this.step['code:arguments'].push({})
      this.editArgument(this.step['code:arguments'].length - 1)
    },
    editArgument: function (index) {
      if (!this.editedFields.includes(index)) {
        this.editedFields.push(index)
      }
    },
    endEditing: function (evt, index, from, to) {
      to['@type'] = from['@type']
      to['@value'] = from['@value']
      this.editedFields.splice(this.editedFields.indexOf(index), 1)
      evt.preventDefault()
    },
    removeArgument: function (index) {
      this.step['code:arguments'].splice(index, 1)
      // shift index of edited elements
      this.editedFields = this.editedFields.map(e => e >= index ? e - 1 : e)
    }
  },
  template: `
<div>
  <b-table :items="items" :fields="fields">
      <template slot="value" slot-scope="data">
          "{{data.item['@value']}}"^^{{data.item['@type']}}
      </template>
      
      <template slot="actions" slot-scope="row">
          <b-button @click.stop="editArgument(row.index)">Edit</b-button>
          <b-button @click.stop="removeArgument(row.index)" variant="danger">Delete</b-button>
      </template>
      <template slot="row-details" slot-scope="row">
          <b-form @submit.stop="saveArgument($event, row)">
              <b-form-group label="Type" label-for="type">
                  <b-select id="type" :options="types" v-model="row.item['@type']"></b-select>
              </b-form-group>
              <b-form-group label="Value" label-for="value">
                  <b-form-input id="value" v-model="row.item['@value']"></b-form-input>
              </b-form-group>
              <b-button type="submit" variant="primary">Save</b-button>
              <b-button @click="revertArgument($event, row)" variant="secondary">Revert</b-button>
          </b-form>        
      </template>
  </b-table>
  
  <b-button variant="primary" @click="addArgument">Add</b-button>
</div>`
})
