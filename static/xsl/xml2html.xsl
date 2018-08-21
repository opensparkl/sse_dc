<?xml version="1.0" encoding="UTF-8"?>

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

  Transforms XML into HTML suitable for rendering.
-->
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  exclude-result-prefixes="xsi">

  <xsl:output method="html" indent="yes"/>

  <!--
    Element with no content only attributes.
  -->
  <xsl:template match="*[not(child::node())]">
    <div class="element empty">
      <span class="open-tag">
        <xsl:text>&lt;</xsl:text>
        <xsl:value-of select="local-name()"/>
      </span>

      <xsl:apply-templates select="@*"/>

      <span class="close-tag">
        <xsl:text>/&gt;</xsl:text>
      </span>
    </div>
  </xsl:template>

  <!--
    Element with content (text or children).
  -->
  <xsl:template match="*">
    <div class="element">
      <span class="open-tag lt-symbol">
        <xsl:text>&lt;</xsl:text>
        <xsl:value-of select="local-name()"/>
      </span>

      <xsl:apply-templates select="@*"/>

      <span class="open-tag gt-symbol">
        <xsl:text>&gt;</xsl:text>
      </span>

      <xsl:apply-templates select="node()"/>

      <span class="close-tag">
        <xsl:text>&lt;/</xsl:text>
        <xsl:value-of select="local-name()"/>
        <xsl:text>&gt;</xsl:text>
      </span>
    </div>
  </xsl:template>

  <!--
    Attribute.
  -->
  <xsl:template match="@*">
    <span class="attribute">
      <xsl:text> </xsl:text>
      <span class="name">
        <xsl:value-of select="local-name()"/>
      </span>
      <span>
        <xsl:text>=</xsl:text>
      </span>
      <span class="value">
        <xsl:text>"</xsl:text>
        <xsl:value-of select="."/>
        <xsl:text>"</xsl:text>
      </span>
    </span>
  </xsl:template>

  <!--
    Text anywhere under prop element is rendered.
  -->
  <xsl:template match="prop//text()">
    <div class="text">
      <xsl:if test="parent::prop[@content-type]">
        <xsl:attribute name="data-content-type">
          <xsl:value-of select="parent::prop/@content-type"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:value-of select="."/>
    </div>
  </xsl:template>

  <!--
    Remove other text.
  -->
  <xsl:template match="text()"/>

</xsl:stylesheet>
