<template>
  <div>
    <ul class="collection">
      <li class="collection-item" v-for="test in tests" v-if="test.status!='rejected'">
        <div>
          {{test.name}} 
          <a class="waves-effect waves-light btn-flat secondary-content" v-if="test.status == 'accepted'" v-on:click="takeTest(test.id)">Take test</a>
          <a class="waves-effect waves-light btn-flat secondary-content" v-if="test.status == 'available'" v-on:click="rejectTest(test.id)">Reject Test</a>
          <a class="waves-effect waves-light btn-flat secondary-content" v-if="test.status == 'available' && !test.need_screening" v-on:click="acceptTest(test.id)">Accept Test</a>
          <a class="waves-effect waves-light btn-flat secondary-content" v-if="test.status == 'available' && test.need_screening" v-on:click="enterScreening(test.id)">Enter Screening</a>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
    	tests: []
    }
  },
  created () {
    this.getData();
  },
  http: {
    root: 'https://jsonplaceholder.typicode.com',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  },
  methods: {
  	getData: function(event) {
  		this.tests = [
        {id: 0, name: 'Test 1', status: 'accepted'},
        {id: 1, name: 'Test 2', status: 'available'},
        {id: 2, name: 'Test 3', status: 'available', need_screening: true},
        {id: 3, name: 'Test 4', status: 'rejected'},
      ];
  	}, 
    takeTest: function (testID) {
      this.$router.push('/test/'+testID);
    }, 
    acceptTest: function (testID) {
      this.tests[testID].status = 'accepted';      
    }, 
    rejectTest: function (testID) {
      this.tests[testID].status = 'rejected';
    }, 
    enterScreening: function (testID) {
      this.$router.push('/screening/'+testID);
    }
  }
}
</script>
