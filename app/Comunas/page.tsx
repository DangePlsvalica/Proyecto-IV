"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';



interface FormData {
    codigoComuna: string;
    numeroComisionPromotora: number;
    fechaComisionPromotora: Date;
    hojaSeguridadComuna: string;
    rifCuentaBancaria: string;
    numeroCuentaBancaria: string;
    fechaRegistroComuna: Date;
    nombreComuna: string;
    direccionComuna: string;
    linderoNorte: string;
    linderoSur: string;
    linderoEste: string;
    linderoOeste: string;
    consejoComunalIntegra: string;
    codigoSitur: string;
    fechaUltimaEleccion: Date;
    municipio: string;
    parroquia: string;
    nombreVocero: string;
    cedulaVocero: string;
    telefonoVocero: string;
    cantidadConsejoComunal: number;
    conParlamentoBanco: boolean;
    poblacionVotante: number;
    votosSi: number;
    votosNo: number;
    votosNulos: number;
}

const validationSchema = Yup.object().shape({
    codigoComuna: Yup.string().required('El código de la comuna es requerido'),
    numeroComisionPromotora: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value)).required('El número de comisión promotora es requerido'),
    fechaComisionPromotora: Yup.date().required('La fecha de comisión promotora es requerida'),
    hojaSeguridadComuna: Yup.string().required('La hoja de seguridad de la comuna es requerida'),
    rifCuentaBancaria: Yup.string().required('El RIF es requerido'),
    numeroCuentaBancaria: Yup.string().required('la cuenta bancaria es requerido'),
    fechaRegistroComuna: Yup.date().required('La fecha de registro de la comuna es requerida'),
    nombreComuna: Yup.string().required('El nombre de la comuna es requerido'),
    direccionComuna: Yup.string().required('La dirección de la comuna es requerida'),
    linderoNorte: Yup.string().required('El lindero norte es requerido'),
    linderoSur: Yup.string().required('El lindero sur es requerido'),
    linderoEste: Yup.string().required('El lindero este es requerido'),
    linderoOeste: Yup.string().required('El lindero oeste es requerido'),
    consejoComunalIntegra: Yup.string().required('El consejo comunal que integra la comuna es requerido'),
    codigoSitur: Yup.string().required('El código SITUR es requerido'),
    fechaUltimaEleccion: Yup.date().required('La fecha de última elección es requerida'),
    municipio: Yup.string().required('El municipio es requerido'),
    parroquia: Yup.string().required('La parroquia es requerida'),
    nombreVocero: Yup.string().required('El nombre del vocero es requerido'),
    cedulaVocero: Yup.string().required('La cédula del vocero es requerida'),
    telefonoVocero: Yup.string().required('El teléfono del vocero es requerido'),
    cantidadConsejoComunal: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('La cantidad de consejo comunal es requerida'),
    conParlamentoBanco: Yup.boolean().required('Se requiere especificar si tiene parlamento y banco'),
    poblacionVotante: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('La población votante es requerida'),
    votosSi: Yup.number().transform((value) => (isNaN(value) ? undefined : value))
        .required('Los votos (SI) son requeridos'),
    votosNo: Yup.number()
        .transform((value) => (isNaN(value) ? undefined : value)).required('Los votos (NO) son requeridos'),
    votosNulos: Yup.number().transform((value) => (isNaN(value) ? undefined : value))
        .required('Los votos nulos son requeridos'),
});

const ComunasForm = () => {
    const { register, handleSubmit, formState } = useForm<FormData>({
        resolver: yupResolver(validationSchema),
    });

    const { errors } = formState;

    const onSubmit = (data: FormData) => {
        console.log(data);
        // Aquí puedes añadir la lógica para enviar los datos del formulario
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Formulario de Comunas</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                {/* Campos del formulario */}
                <div className="col-span-1">
                    <label className="text-left font-bold">CODIGO COMUNA</label>
                    <input type="text" {...register('codigoComuna')} className="border p-2 w-full" />
                    {errors.codigoComuna && <p className="text-red-500">{errors.codigoComuna.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">NUMERO DE COMISION PROMOTORA</label>
                    <input type="number" {...register('numeroComisionPromotora')} className="border p-2 w-full" />
                    {errors.numeroComisionPromotora && <p className="text-red-500">{errors.numeroComisionPromotora.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">FECHA DE COMISION PROMOTORA</label>
                    <input type="date" {...register('fechaComisionPromotora')} className="border p-2 w-full" />
                    {errors.fechaComisionPromotora && <p className="text-red-500">{errors.fechaComisionPromotora.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">HOJA DE SEGURIDAD DE LA COMUNA</label>
                    <input type="text" {...register('hojaSeguridadComuna')} className="border p-2 w-full" />
                    {errors.hojaSeguridadComuna && <p className="text-red-500">{errors.hojaSeguridadComuna.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">RIF</label>
                    <input type="text" {...register('rifCuentaBancaria')} className="border p-2 w-full" />
                    {errors.rifCuentaBancaria && <p className="text-red-500">{errors.rifCuentaBancaria.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">CUENTA BANCARIA</label>
                    <input type="text" {...register('numeroCuentaBancaria')} className="border p-2 w-full" />
                    {errors.numeroCuentaBancaria && <p className="text-red-500">{errors.numeroCuentaBancaria.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">FECHA DE REGISTRO DE LA COMUNA</label>
                    <input type="date" {...register('fechaRegistroComuna')} className="border p-2 w-full" />
                    {errors.fechaRegistroComuna && <p className="text-red-500">{errors.fechaRegistroComuna.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">NOMBRE DE LA COMUNA</label>
                    <input type="text" {...register('nombreComuna')} className="border p-2 w-full" />
                    {errors.nombreComuna && <p className="text-red-500">{errors.nombreComuna.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">DIRECCION DE LA COMUNA</label>
                    <input type="text" {...register('direccionComuna')} className="border p-2 w-full" />
                    {errors.direccionComuna && <p className="text-red-500">{errors.direccionComuna.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">LINDERO NORTE</label>
                    <input type="text" {...register('linderoNorte')} className="border p-2 w-full" />
                    {errors.linderoNorte && <p className="text-red-500">{errors.linderoNorte.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">LINDERO SUR</label>
                    <input type="text" {...register('linderoSur')} className="border p-2 w-full" />
                    {errors.linderoSur && <p className="text-red-500">{errors.linderoSur.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">LINDERO ESTE</label>
                    <input type="text" {...register('linderoEste')} className="border p-2 w-full" />
                    {errors.linderoEste && <p className="text-red-500">{errors.linderoEste.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">LINDERO OESTE</label>
                    <input type="text" {...register('linderoOeste')} className="border p-2 w-full" />
                    {errors.linderoOeste && <p className="text-red-500">{errors.linderoOeste.message}</p>}
                </div>

                <div className="col-span-1">
                    <label className="text-left font-bold">CONSEJO COMUNAL QUE LO INTEGRA</label>
                    <input type="text" {...register('consejoComunalIntegra')} className="border p-2 w-full" />
                    {errors.consejoComunalIntegra && <p className="text-red-500">{errors.consejoComunalIntegra.message}</p>}
                </div>

                {/* Tabla 15 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">CODIGO SITUR</label>
                    <input type="text" {...register("codigoSitur")} className="border p-1 w-full" />
                    {errors.codigoSitur && <p className="text-red-500">{errors.codigoSitur.message}</p>}
                </div>

                {/* Tabla 16 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">FECHA DE ULTIMA ELECCION</label>
                    <input type="date" {...register("fechaUltimaEleccion")} className="border p-1 w-full" />
                    {errors.fechaUltimaEleccion && <p className="text-red-500">{errors.fechaUltimaEleccion.message}</p>}
                </div>

                {/* Tabla 17 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">MUNICIPIO</label>
                    <input type="text" {...register("municipio")} className="border p-1 w-full" />
                    {errors.municipio && <p className="text-red-500">{errors.municipio.message}</p>}
                </div>

                {/* Tabla 18 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">PARROQUIA</label>
                    <input type="text" {...register("parroquia")} className="border p-1 w-full" />
                    {errors.parroquia && <p className="text-red-500">{errors.parroquia.message}</p>}
                </div>

                {/* Tabla 19 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">NOMBRE Y APELLIDOS DEL VOCERO</label>
                    <input type="text" {...register("nombreVocero")} className="border p-1 w-full" />
                    {errors.nombreVocero && <p className="text-red-500">{errors.nombreVocero.message}</p>}
                </div>

                {/* Tabla 20 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">C.I</label>
                    <input type="text" {...register("cedulaVocero")} className="border p-1 w-full" />
                    {errors.cedulaVocero && <p className="text-red-500">{errors.cedulaVocero.message}</p>}
                </div>

                {/* Tabla 21 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">TELEFONO</label>
                    <input type="tel" {...register("telefonoVocero")} className="border p-1 w-full" />
                    {errors.telefonoVocero && <p className="text-red-500">{errors.telefonoVocero.message}</p>}
                </div>

                {/* Tabla 22 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">CANTIDAD DE CONSEJO COMUNAL QUE INTEGRA LA COMUNA</label>
                    <input type="number" {...register("cantidadConsejoComunal")} className="border p-1 w-full" />
                    {errors.cantidadConsejoComunal && <p className="text-red-500">{errors.cantidadConsejoComunal.message}</p>}
                </div>

                {/* Tabla 23 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">CON BANCO Y PARLAMENTO</label>
                    <select {...register("conParlamentoBanco")} className="border p-1 w-full">
                        <option value={true}>Sí</option>
                        <option value={false}>No</option>
                    </select>
                    {errors.conParlamentoBanco && <p className="text-red-500">{errors.conParlamentoBanco.message}</p>}
                </div>

                {/* Tabla 24 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">POBLACION VOTANTE</label>
                    <input type="number" {...register("poblacionVotante")} className="border p-1 w-full" />
                    {errors.poblacionVotante && <p className="text-red-500">{errors.poblacionVotante.message}</p>}
                </div>

                {/* Tabla 25 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">VOTOS (SI)</label>
                    <input type="number" {...register("votosSi")} className="border p-1 w-full" />
                    {errors.votosSi && <p className="text-red-500">{errors.votosSi.message}</p>}
                </div>

                {/* Tabla 26 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">VOTOS (NO)</label>
                    <input type="number" {...register("votosNo")} className="border p-1 w-full" />
                    {errors.votosNo && <p className="text-red-500">{errors.votosNo.message}</p>}
                </div>

                {/* Tabla 27 */}
                <div className="col-span-1">
                    <label className="text-left font-bold">VOTOS NULOS</label>
                    <input type="number" {...register("votosNulos")} className="border p-1 w-full" />
                    {errors.votosNulos && <p className="text-red-500">{errors.votosNulos.message}</p>}
                </div>
       
<div className="col-span-2 flex justify-between">
  <button type="submit" className="bg-blue-500 text-white p-2 rounded">Enviar</button>

</div>
            </form>
        </div>
    );
};

export default ComunasForm;