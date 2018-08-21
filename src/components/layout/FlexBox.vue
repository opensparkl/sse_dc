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

  Wrapper for CSS Flexbox.
  See https://css-tricks.com/snippets/css/a-guide-to-flexbox/
-->
<script>
export default {
  name: 'FlexBox',
  render (createElement) {
    return createElement(
      'div',
      {
        class: this.className,
        style: this.style
      },
      [this.$slots.default]
    )
  },
  props: {
    direction: {
      type: String
    },
    wrap: {
      type: String
    },
    size: {
      type: Number
    },
    spread: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style () {
      return {
        'flex-direction': this.direction,
        'flex-wrap': this.wrap
      }
    },
    className () {
      return {
        'flex-box': true,
        'flex-spread': this.spread,
        [`flex-box-size-${this.size}`]: this.size
      }
    }
  }
}
</script>
<style lang="scss">
.flex-box {
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;

  & > * {
    flex: 1 1 auto;
  }

  @for $i from 1 through 12 {
    &.flex-box-size-#{$i} > * {
      flex: 1 1 100%/$i;
    }
  }
}
</style>
