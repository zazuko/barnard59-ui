<script>
export default {
  name: 'ImplementedByEcmascript',
  props: [
    'implementation'
  ]
}
</script>

<template>
  <input
    type="text"
    class="form-control"
    id=""
    v-model="implementation['code:link']">
</template>
