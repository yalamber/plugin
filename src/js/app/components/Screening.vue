<template>
  <div>
    Screening for test: {{testID}}
    <template v-for="question in questions">
      <div class="question">
        <p>{{question.title}}</p>
        <label><input type="radio" v-model="answer[question.id]" value="yes"> Yes</label>
        <label><input type="radio" v-model="answer[question.id]" value="no"> No</label>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data () {
    return {
    	questions: [],
      answer: [],
      testID: ''
    }
  },
  created () {
    this.getData();
  },
  methods: {
    getData: function () {
      this.testID = this.$route.params.test_id;
      this.questions = [
        {id:0, title: "Test Question 1?"},
        {id:1, title: "Test Question 2?"}
      ];
    },
  	submitScreening: function (testID) {
      
    }
  }
}
</script>
