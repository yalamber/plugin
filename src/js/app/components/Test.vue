<template>
<div>
  <div v-if="generalInstructions">
    <p>General Instructions for test: {{testID}}</p>
    <a class="waves-effect waves-light btn-flat" v-on:click="initTest(testID)">Start Test</a>
  </div>
  <div v-if="testInstructions">
    <p>Start Test: {{testID}}</p>
    <p>Test Instructions here</p>
    <a class="waves-effect waves-light btn-flat" v-on:click="startTest(testID)">Next</a>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      testID: '',
      generalInstructions: true,
      testInstructions: false
    }
  },
  created () {
    this.getData();
  },
  methods: {
    getData: function () {
      this.testID = this.$route.params.test_id;

    },
  	initTest: function (testID) {
      this.generalInstructions = false;
      this.testInstructions = true;
      
    },
    startTest: function (testID) {
      this.$router.push('/record/'+testID);
      
    }
  }
}
</script>
