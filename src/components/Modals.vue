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

  Component that contains all modals (just for convenience).
-->
<template>
  <div>
    <v-dialog/>
    <info-modal/>
    <user-info-modal/>
    <create-folder-modal/>
    <unit-test-modal/>
    <graph-modal/>
  </div>
</template>
<script>
import VDialog from './modals/Dialog'
import InfoModal from './modals/InfoModal'
import UnitTestModal from './modals/UnitTestModal'
import UserInfoModal from './modals/UserInfoModal'
import CreateFolderModal from './modals/CreateFolderModal'
import GraphModal from './modals/GraphModal'

export default {
  name: 'Modals',
  components: {
    VDialog,
    GraphModal,
    InfoModal,
    UserInfoModal,
    CreateFolderModal,
    UnitTestModal
  }
}
</script>
