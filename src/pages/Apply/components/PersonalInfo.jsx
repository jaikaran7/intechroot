import Input from "../../../components/Form/Input";

export default function PersonalInfo({ form, onChange, errors }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative floating-label-group">
          <Input
            className="block w-full px-0 py-3 bg-transparent border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-secondary transition-all text-on-surface font-medium"
            id="name"
            name="name"
            placeholder=" "
            type="text"
            value={form.name}
            onChange={onChange}
          />
          <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-300 font-medium text-sm" htmlFor="name">
            Full Name
          </label>
          {errors.name ? <p className="text-[10px] text-error mt-2">{errors.name}</p> : null}
        </div>
        <div className="relative floating-label-group">
          <Input
            className="block w-full px-0 py-3 bg-transparent border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-secondary transition-all text-on-surface font-medium"
            id="phone"
            name="phone"
            placeholder=" "
            type="tel"
            value={form.phone}
            onChange={onChange}
          />
          <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-300 font-medium text-sm" htmlFor="phone">
            Phone Number
          </label>
          {errors.phone ? <p className="text-[10px] text-error mt-2">{errors.phone}</p> : null}
        </div>
      </div>
      <div className="relative floating-label-group">
        <Input
          className="block w-full px-0 py-3 bg-transparent border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-secondary transition-all text-on-surface font-medium"
          id="email"
          name="email"
          placeholder=" "
          type="email"
          value={form.email}
          onChange={onChange}
        />
        <label className="absolute left-0 top-3 text-on-surface-variant pointer-events-none transition-all duration-300 font-medium text-sm" htmlFor="email">
          Professional Email Address
        </label>
        {errors.email ? <p className="text-[10px] text-error mt-2">{errors.email}</p> : null}
      </div>
    </>
  );
}
