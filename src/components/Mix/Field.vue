<!--
  Copyright 2018 SPARKL Limited

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Component is responsible for rendering fields attached to
  an opperation.
-->
<template>
  <div class="operation-field"
       :class="node.attr.id"
       @mouseenter.stop="mouseenter"
       @mouseleave.stop="mouseleave">
    <i :class="['fa fa-fw', arrow]"/>
    <span>{{node.attr.name}}</span>
  </div>
</template>
<script>
  export default {
    name: 'Field',
    props: ['parent', 'node'],
    methods: {
      remove () {
        var fields = this.parent.attr.fields
        this.parent.attr.fields = fields.filter(v => v !== this.id)
      },
      mouseenter () {
        var elements = document
          .querySelectorAll('.operation-field.' + this.id)

        for (var i = 0; i < elements.length; i++) {
          elements[i].classList.add('hovered')
        }
      },
      mouseleave () {
        var elements = document
          .querySelectorAll('.operation-field.hovered')

        for (var i = 0; i < elements.length; i++) {
          elements[i].classList.remove('hovered')
        }
      }
    },
    computed: {
      id () {
        return this.node.attr.id
      },
      arrow () {
        var tag = this.parent.tag

        return tag === 'solicit' || tag === 'reply' || tag === 'notify'
          ? 'fa-long-arrow-right'
          : 'fa-long-arrow-left'
      }
    }
  }
</script>
