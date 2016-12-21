<template>
<div>
  <div v-if="initTest">
    <p>General Instructions for test: {{testID}}</p>
    <a class="waves-effect waves-light btn-flat" v-on:click="startTest(test.id)">Start Test</a>
  </div>
  <div v-if="startTest">
    <p>Start Test: {{testID}}</p>
    <p>Test Instructions here</p>
    <a class="waves-effect waves-light btn-flat" v-on:click="startTestNext(test.id)">Next</a>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      testID: '',
      initTest: true,
      startTest: false
    }
  },
  created () {
    this.getData();
  },
  methods: {
    getData: function () {
      this.testID = this.$route.params.test_id;

    },
  	startTest: function (testID) {
      this.initTest = false;
      this.startTest = true;
    },
    startTestNext: function (testID) {
        //start recorder
    }
  }
}
</script>
