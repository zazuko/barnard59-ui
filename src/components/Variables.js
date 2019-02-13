import Vue from 'vue/dist/vue'
import Table from 'bootstrap-vue/es/components/table/table'
import Button from 'bootstrap-vue/es/components/button/button'
import Input from 'bootstrap-vue/es/components/form-input/form-input'
import { createNamespacedHelpers } from 'vuex'
import { addVariable, deleteVariable, saveVariable } from '../store/pipeline-actions'

const { mapActions } = createNamespacedHelpers('pipeline')

export default Vue.component('variables', {
  props: [
    'variables'
  ],
  components: {
    'b-table': Table,
    'b-button': Button,
    'b-form-input': Input
  },
  data: () => ({
    fields: [ 'index', 'name', 'value', 'actions' ],
    newVariable: {
      name: '',
      value: ''
    }
  }),
  computed: {
    items: function () {
      if (!this.variables) {
        return []
      }

      return this.variables.map((v, index) => ({
        index: index + 1,
        ...v
      }))
    }
  },
  methods: {
    ...mapActions({
      save: saveVariable,
      add: addVariable,
      deleteVariable: deleteVariable
    }),
    addAndReset (name, value) {
      this.add({ name, value })
        .then(() => {
          this.newVariable = {
            name: '',
            value: ''
          }
        })
    }
  },
  template: `
<div>
  <b-table :items="items" :fields="fields" foot-clone>
    <template slot="name" slot-scope="data">
      <b-form-input v-model="data.item.name"></b-form-input>
    </template>
    <template slot="value" slot-scope="data">
      <b-form-input v-model="data.item.value"></b-form-input>
    </template>
    <template slot="actions" slot-scope="row">
      <b-button @click.stop="save(row.index, row.item.name, row.item.value)">Save</b-button>
      <b-button @click.stop="deleteVariable(row.index)" variant="danger">Delete</b-button>
    </template>
    
    <template slot="FOOT_index" slot-scope="data">
      New variable:
    </template>
    <template slot="FOOT_name" slot-scope="data">
      <b-form-input v-model="newVariable.name"></b-form-input>
    </template>
    <template slot="FOOT_value" slot-scope="data">
      <b-form-input v-model="newVariable.value"></b-form-input>
    </template>
    <template slot="FOOT_actions" slot-scope="data">
      <b-button @click.stop="addAndReset(newVariable.name, newVariable.value)">Add</b-button>
    </template>
  </b-table>
</div>`
})
