<template>
  <div class="user">
    <picture class="user__img">
      <source media="(max-width: 768px)" :srcset="user.picture.thumbnail">
      <source media="(max-width: 1024px)" :srcset="user.picture.medium">
      <source :srcset="user.picture.large">
      <img :src="user.picture.large" alt="">
    </picture>
    <div class="user__fullname">
      {{ user.name.title }} {{ user.name.first }} {{ user.name.last }}
    </div>
    <div class="user__birthday">
      <p>
        {{ formatDate(user.dob.date) }},
      </p>
      <p>
        {{ user.dob.age }} y.o.
      </p>
    </div>
    <div class="user__email">
      <a :href="`mailto: ${user.email}`">{{ user.email }}</a>
    </div>
    <div class="user__phone">
      <a :href="`tel: ${user.phone}`">{{ user.phone }}</a>
    </div>
    <div class="user__location">
      {{ user.location.country }}, {{ user.location.city }}
    </div>
    <div class="user__nationality">
      {{ user.nat }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
    }
  },
  methods: {
    formatDate(date) {// метод форматирования даты в формат (формат - День недели, mm/dd/yyyy, hh:mm am, кол-во лет)
      if (!date) return ''

      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
      }

      return new Date(date).toLocaleString('en-US', options)
    },
  },
}
</script>

<style scoped lang="scss">
.users--line .user {
  display: grid;
  grid-template-columns: 150px 1fr 250px 1fr 150px 1fr 100px;
  border-radius: 8px;
  align-items: center;
  gap: 8px;
  padding: 12px;

  @media screen and (max-width: 1250px){
    grid-template-areas:
    'img fullname email location'
    'img birthday phone nationality';
    grid-template-columns: 150px repeat(3, 1fr);
    &__img {
      grid-area: img;
    }
    &__fullname {
      grid-area: fullname;
    }
    &__birthday {
      grid-area: birthday;
    }
    &__email {
      grid-area: email;
    }
    &__phone {
      grid-area: phone;
    }
    &__location {
      grid-area: location;
    }
    &__nationality {
      grid-area: nationality;
    }
  }
  @media screen and (max-width: 950px){
    grid-template-columns: 100px repeat(2, 1fr);
    grid-template-areas:
    'img fullname email'
    'img birthday location'
    '. phone nationality';
  }
  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
    grid-template-areas:
    'img'
    'fullname'
    'birthday'
    'phone'
    'email'
    'location'
    'nationality';
  }
}

.users--tile .user {
  display: grid;
  gap: 8px;
  grid-template-areas:
    'img fullname email location'
    'img birthday phone nationality';
  grid-template-columns: 150px repeat(3, 1fr);
  padding: 12px;
  border: 1px solid red;
  border-radius: 8px;

  &__img {
    grid-area: img;
  }
  &__fullname {
    grid-area: fullname;
  }
  &__birthday {
    grid-area: birthday;
  }
  &__email {
    grid-area: email;
  }
  &__phone {
    grid-area: phone;
  }
  &__location {
    grid-area: location;
  }
  &__nationality {
    grid-area: nationality;
  }

  @media screen and (max-width: 1920px){
    grid-template-columns: 100px repeat(2, 1fr);
    grid-template-areas:
    'img fullname email'
    'img birthday location'
    '. phone nationality';
  }
  @media screen and (max-width: 1550px) {
    grid-template-columns: 1fr;
    grid-template-areas:
    'img'
    'fullname'
    'birthday'
    'phone'
    'email'
    'location'
    'nationality';
  }
}
</style>