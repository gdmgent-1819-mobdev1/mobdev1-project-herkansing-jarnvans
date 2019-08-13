class Profile {
  constructor(id, first, last, str, no, postalCode, city, lat, lng, email, phone) {
    this.id = id;
    this.firstName = first;
    this.lastName = last;
    this.address = {
      street: str,
      number: no,
      postcode: postalCode,
      town: city,
    };
    this.coords = {
      latitude: lat,
      longitude: lng,
    };
    this.email = email;
    this.phoneNumber = phone;
  }
}

class Student extends Profile {
  constructor(id, first, last, str, no, postalCode, city, lat, lng, email, phone, type, school) {
    super(id, first, last, str, no, postalCode, city, lat, lng, email, phone);
    this.type = type;
    this.school = school;
  }
}

class Owner extends Profile {
  constructor(id, first, last, str, no, postalCode, city, lat, lng, email, phone, type) {
    super(id, first, last, str, no, postalCode, city, lat, lng, email, phone);
    this.type = type;
  }
}

class Room {
  constructor(id, address, coords, price, roomInfo, ownerId) {
    this.id = id;
    this.address = {
      street: address.street,
      number: address.number,
      postcode: address.postalCode,
      town: address.city,
    };
    this.coords = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    this.price = {
      rent: price.rent,
      guarantee: price.guarantee,
    };
    this.roomInfo = {
      type: roomInfo.type,
      acreage: roomInfo.acreage,
      level: roomInfo.level,
      persons: roomInfo.persons,
      rooms: roomInfo.rooms,
      toilet: roomInfo.toilet,
      shower: roomInfo.shower,
      bath: roomInfo.bath,
      kitchen: roomInfo.kitchen,
      furniture: roomInfo.furniture,
      descriptionFurniture: roomInfo.descriptionFurniture,
      extra: roomInfo.extra,
    };
    this.ownerId = ownerId;
  }
}

export {
  Student, Owner, Room,
};
