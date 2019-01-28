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
    fields: [ 'index', 'value', 'actions' ]
  }),
  computed: {
    items: function () {
      if (!this.step) return []

      return this.step['code:arguments'].map((arg, index) => ({
        index: index + 1,
        ...arg,
        _showDetails: false
      }))
    }
  },
  methods: {
    saveArgument: function (evt, row) {
      const args = this.step['code:arguments'][row.index]
      args['@type'] = row.item['@type']
      args['@value'] = row.item['@value']
      row.toggleDetails()
      evt.preventDefault()
    },
    revertArgument: function (evt, row) {
      const args = this.step['code:arguments'][row.index]
      row.item['@type'] = args['@type']
      row.item['@value'] = args['@value']
      row.toggleDetails()
      evt.preventDefault()
    }
  },
  template: `
<b-table :items="items" :fields="fields">
    <template slot="value" slot-scope="data">
        "{{data.item['@value']}}"^^{{data.item['@type']}}
    </template>
    
    <template slot="actions" slot-scope="row">
        <b-button @click.stop="row.toggleDetails">Edit</b-button>
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
</b-table>`
})
