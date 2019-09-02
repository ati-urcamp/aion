<script>
  const defaultLabel = 'Descrição'

  export default {
    name: 'html-editor',
    props: {
      label: { type: String, default: defaultLabel },
      model: { type: String, default: '' },
      height: { type: String, default: '350px' }
    },
    data () {
      return {
        hasFocus: false,
        editorOptions: {
          placeholder: defaultLabel + '...',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['code-block'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['link'],
              ['clean']
            ]
          }
        }
      }
    },
    computed: {
      quill () {
        return this.$refs.myQuillEditor && this.$refs.myQuillEditor.quill
      },
      content: {
        get: function () {
          return this.model
        },
        set: function (newValue) {
          this.$emit('update:model', newValue)
        }
      }
    },
    methods: {
      onEditorBlur ($event) {
        this.hasFocus = false
      },
      onEditorFocus ($event) {
        this.hasFocus = true
      }
    }
  }
</script>

<template>
    <div class="form-editor"
         :class="{'-focus': hasFocus}">
        <label class="editor-label">{{label}}</label>
        <quill-editor v-model="content"
                      ref="myQuillEditor"
                      :options="editorOptions"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      :style="'height:' + height">
        </quill-editor>
    </div>
</template>

<style lang="scss">
    .form-editor {
        padding-bottom: 45px;

        .editor-label {
            display: block;
            line-height: 28px;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);
        }

        .ql-toolbar.ql-snow {
            border-color: rgba(0, 0, 0, 0.3);
        }

        .ql-toolbar.ql-snow + .ql-container.ql-snow {
            border-color: rgba(0, 0, 0, 0.3);
        }

        &.-focus {
            .editor-label {
                color: #465e54;
            }

            .ql-toolbar.ql-snow {
                border-color: #465e54;
            }

            .ql-toolbar.ql-snow + .ql-container.ql-snow {
                border-color: #465e54;
            }

        }
    }

    @media all and (max-width: 768px) {
        .form-editor {
            padding-bottom: 120px;
        }
    }
</style>
