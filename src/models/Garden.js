let keystone = require('keystone');

const Types = keystone.Field.Types;

/**
 * Garden Model
 * =============
 */

const Garden = new keystone.List('Garden', {
	autokey: { from: 'name', path: 'key' },
	defaultSort: '-cuid',
});

const dataField = {
	cuid: { type: String },
	name: { type: String, required: true },
	localName: { type: String },
	otherName: { type: Types.TextArray },
	scientificName: { type: String },
	synonym: { type: String },
	family: { type: String, label: 'Family' },
	new_family: { type: String, label: 'Family (ใหม่)' },
	type: { type: String, label: 'ประเภท' },
	locationName: { type: String, label: 'สถานที่' },
	display: { type: Types.Select, options: 'Seed, Mineral, Fruit, Miscellaneous, Bark, Animal, Flower, Leaf' },
	recipe: { type: String, label: 'วิธีการได้มา' },
	property: { type: String },
	localProperty: { type: String, label: 'สรรพคุณพื้นบ้าน' },
	minorBenefit: { type: String, label: 'สรรพคุณประโยชน์อื่นๆ' },
	anatomy: { type: Types.TextArray, label: 'ลักษณะทางวิทยาศาสตร์' },
	toxicDetail: { type: String, label: 'ความเป็นพิษ' },
	adr: { type: String },

	caution: { type: String, label: 'ข้อห้ามใช้' },
	warning: { type: String, label: 'ข้อควรระวังอื่น' },
	images: { type: Types.CloudinaryImages },

	characteristic: { type: String, label: 'ความแตกต่างของพืชสมุนไพร' },

	chem_structure: { type: String, label: 'ส่วนประกอบทางเคมี' },
	prod_dev: { type: String, label: 'Product Development' },
	slotNo: { type: String, label: 'Museum location' },
	herbarium_location: { type: String, label: 'Herbarium location' },
	donor: { type: String, label: 'Donor' },

};



Garden.add(dataField);
Garden.getLatestByPage = (args) => {
	return new Promise((resolve, reject) => {
		Garden
			.paginate({
				page: args.page || 0,
				perPage: args.limit || 10,
			})
			.exec((err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
	});
};

Garden.register();
export default Garden;
