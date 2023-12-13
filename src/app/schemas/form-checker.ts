import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'El correo electrónico debe ser un texto',
      required_error: 'El correo electrónico es requerido',
    })
    .trim()
    .email({ message: 'El correo electrónico no es válido' }),
  password: z
    .string({
      required_error: 'La contraseña es requerida',
    })
    .min(8, { message: 'La contraseña debe contener al menos 8 carácteres' }),
});

export const registerShema = z
  .object({
    email: z
      .string({
        required_error: 'El correo electrónico es requerido',
      })
      .email({ message: 'El correo electrónico no es válido' })
      .trim(),
    password: z
      .string({
        required_error: 'El campo "Contraseña" es requerido',
      })
      .min(8, { message: 'El campo "Contraseña" debe contener al menos 8 carácteres' }),
    passwordRepeated: z
      .string({
        required_error: 'El campo "Repite tu contraseña" es requerido',
      })
      .min(8, { message: 'El campo "Repite tu contraseña" debe contener al menos 8 carácteres' }),
    isDriver: z.boolean({ invalid_type_error: 'El campo "Deseas registrarte como conductor" debe ser un booleano' }),
  })
  .refine(data => data.password === data.passwordRepeated, { message: 'Las contraseñas no coinciden' });

export const driverRegisterShema = z
  .object({
    names: z
      .string({ required_error: 'El campo "Nombres" es requerido' })
      .regex(/.*[a-zA-Z].*/, { message: 'El campo "Nombres" es requerido' })
      .trim()
      .toLowerCase(),
    lastNames: z
      .string({ required_error: 'El campo "Apellidos" es requerido' })
      .regex(/.*[a-zA-Z].*/, { message: 'El campo "Apellidos" es requerido' })
      .trim()
      .toLowerCase(),
    cc: z
      .string({ required_error: 'El campo "Número de cédula" es requerido' })
      .min(5, { message: 'El campo "Número de cédula" debe contener al menos 5 carácteres' })
      .regex(/^\d{1,12}$/, {
        message: 'El campo "Número de cédula" debe contener solo números (sin puntos, espacios o giones)',
      }),
    phoneNumber: z
      .string({ required_error: 'El campo "Número de celular" es requerido' })
      .length(10, { message: 'El campo "Número de celular" debe contener 10 dígitos' })
      .regex(/^\d{10}$/, {
        message: 'El campo "Número de celular" debe contener solo números (sin espacios o guiones)',
      })
      .startsWith('3', { message: 'El campo "Número de celular" debe empezar por "3"' }),
    vehicle: z.enum(['Carro', 'Moto'], {
      required_error: 'El campo "Tipo de vehículo es requerido"',
      invalid_type_error: 'El campo "Tipo de vehículo" debe ser "carro" o "moto"',
    }),
    plates: z
      .string({ required_error: 'El campo "Placas del vehículo" es requerido' })
      .length(6, { message: 'El campo "Placas del vehículo" debe tener 6 carácteres (sin guiones o espacios)' })
      .regex(/^(?:[a-zA-Z]{3}\d{3}|[a-zA-Z]{3}\d{2}[a-zA-Z])$/, {
        message: 'El campo "Placas del vehículo" tiene un formato incorrecto',
      })
      .toLowerCase(),
  })
  .refine(
    data => {
      if (data.vehicle === 'Carro') {
        const regex = /^(?:[a-zA-Z]{3}\d{3})$/;
        return regex.test(data.plates);
      } else {
        const regex = /^(?:[a-zA-Z]{3}\d{2}[a-zA-Z])$/;
        return regex.test(data.plates);
      }
    },
    {
      message: 'Las placas ingresadas no corresponden al tipo de vehículo seleccionado',
    }
  );

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerShema>;
export type DriverRegisterSchemaType = z.infer<typeof driverRegisterShema>;
export type DriverUserFirestoreType = DriverRegisterSchemaType & { uid: string };
