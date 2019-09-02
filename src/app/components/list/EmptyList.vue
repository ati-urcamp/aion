<script>
  export default {
    name: 'empty-list',
    props: {
      title: { default: '', Type: String },
      description: { default: '', Type: String },
      showIcon: { default: true, Type: Boolean }
    }
  }
</script>

<template>
    <div class="empty-list">
        <div class="empty-icon" v-if="showIcon">
            <i class="far fa-file-alt"></i>
        </div>
        <h3 v-if="title">{{title}}</h3>
        <p v-if="description">{{description}}</p>
    </div>
</template>

<style lang="scss" scoped>
    .empty-list {
        padding: 20px;

        .empty-icon,
        h3,
        p {
            text-align: center;
        }

        .empty-icon {
            font-size: 100px;
            color: #DDD;
        }

        h3 {
            margin: 0;
            padding: 0;
            font-weight: 500;
            font-size: 20px;
            color: #838383;
        }

        p {
            padding: 15px 0 0;
            font-size: 16px;
            color: #919191;
        }
    }

    @media all and (max-width: 768px) {
        .empty-list {
            .empty-icon {
                font-size: 60px;
            }

            h3 {
                font-size: 15px;
            }
        }
    }
</style>
