<script setup>
</script>

<template>
  <!-- <div > 
    {{ $hasRoutePerm("xxx") }}
  </div>
   <div > 
    {{ $hasBtnPerm("xxx") }}
  </div>
  <div v-if="$hasRoutePerm('xxx')"> 
    xxx route
  </div> 
  <div v-if="$hasBtnPerm('xxx')"> 
    xxx button
  </div> -->
  <div>
    dashboard page
    <router-link to="/admin/users">users</router-link>
  </div>
  <div>
    <router-link to="/admin/public/haha">public haha</router-link>
  </div>
</template>
