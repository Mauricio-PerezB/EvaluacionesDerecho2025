import { EntitySchema } from "typeorm";

export const HorarioSchema = new EntitySchema({
  name: "Horario",
  tableName: "horarios",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment"
    },
    fecha: {
      name: "fecha",
      type: "date",
      nullable: false
    },
    hora: {
      name: "hora",
      type: "time",
      nullable: false
    },
    duracionMinutos: {
      name: "duracion_minutos",
      type: "int",
      nullable: false
    },
    disponible: {
      name: "disponible",
      type: "boolean",
      default: true
    },
    estudianteId: {
      name: "estudiante_id",
      type: "int",
      nullable: true
    },
    publicado: {
      name: "publicado",
      type: "boolean",
      default: false
    },
    modalidad: {
      name: "modalidad",
      type: "varchar",
      length: 50,
      default: "presencial"
    },
    plataforma: {
      name: "plataforma",
      type: "varchar",
      length: 100,
      nullable: true
    },
    link: {
      name: "link",
      type: "varchar",
      length: 255,
      nullable: true
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      name: "updated_at",
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    profesor: {
      target: "Usuario",
      type: "many-to-one",
      joinColumn: { name: "profesor_id" },
      inverseSide: "horariosCreado"
    },
    alumno: {
      target: "Usuario",
      type: "many-to-one",
      joinColumn: { name: "alumno_id" },
      nullable: true,
      inverseSide: "horariosAsignado"
    },
    ramo: {
      target: "Ramo",
      type: "many-to-one",
      joinColumn: { name: "ramo_id" }
    }
  }
});

// Backwards-compatible in-memory exports for existing services
export const HorariosDB = [];

let _nextId = 1;
const generarId = () => _nextId++;

export class HorarioEntity {
  constructor({ fecha, hora, duracionMinutos, disponible = true, estudianteId = null, publicado = false, modalidad = 'presencial', plataforma = null, link = null } = {}) {
    this.id = generarId();
    this.fecha = fecha;
    this.hora = hora;
    this.duracionMinutos = parseInt(duracionMinutos);
    this.disponible = disponible;
    this.estudianteId = estudianteId;
    this.publicado = publicado;
    this.modalidad = modalidad;
    this.plataforma = plataforma;
    this.link = link;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export default HorarioEntity;
