<template>
  <div>
    <h2>Data called from JSON API through HTTPS</h2>
    <p>{{response}}</p>
    <button v-on:click="getData">Get Data</button>
  </div>
</template>
<script>
export default {
  data () {
    return {
    	response: "response placeholder",

    }
  },
  http: {
    root: 'https://jsonplaceholder.typicode.com',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  },  
  methods: {
  	getData: function(event) {
  		this.$http.get('posts/1').then((response) => {
        this.response = response
      }, (response) => {
        this.response = response
      });
  	}
  }
}
</script>