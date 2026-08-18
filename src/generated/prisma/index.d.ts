
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * The authenticated person who owns one or more patient profiles.
 * This is the patient-app user: signs in (phone OTP) against the SAME
 * Supabase Auth as doctors; `authUserId` maps auth.uid() → this Account.
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Doctor
 * A verified clinician who signs in to the doctor portal.
 */
export type Doctor = $Result.DefaultSelection<Prisma.$DoctorPayload>
/**
 * Model Pharmacy
 * A partner pharmacy that fulfils prescriptions (the "Fulfil" step of the
 * care loop). Mirrors Doctor: signs up against the same Supabase Auth,
 * completes a country-aware verification wizard, then waits for approval.
 */
export type Pharmacy = $Result.DefaultSelection<Prisma.$PharmacyPayload>
/**
 * Model Patient
 * A patient profile. An account is NOT a patient; relationships are explicit.
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model AriaHandover
 * ARIA (AI intake) structured, UNVERIFIED summary handed to a clinician.
 */
export type AriaHandover = $Result.DefaultSelection<Prisma.$AriaHandoverPayload>
/**
 * Model QueueEntry
 * A live position in the consult queue. When a patient requests an on-demand
 * consult, doctorId is NULL (unassigned pool); an on-call doctor claims it
 * atomically (sets doctorId + state=in_consult). Scheduled/seeded rows keep a
 * doctor from the start.
 */
export type QueueEntry = $Result.DefaultSelection<Prisma.$QueueEntryPayload>
/**
 * Model Encounter
 * A completed or in-progress clinical encounter (the care plan).
 */
export type Encounter = $Result.DefaultSelection<Prisma.$EncounterPayload>
/**
 * Model ConsentGrant
 * Purpose-specific, revocable consent that gates record access.
 */
export type ConsentGrant = $Result.DefaultSelection<Prisma.$ConsentGrantPayload>
/**
 * Model AuditEvent
 * Immutable audit trail: who / what / why.
 */
export type AuditEvent = $Result.DefaultSelection<Prisma.$AuditEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Sex: {
  male: 'male',
  female: 'female',
  other: 'other'
};

export type Sex = (typeof Sex)[keyof typeof Sex]


export const TriageLevel: {
  emergency: 'emergency',
  urgent: 'urgent',
  routine: 'routine'
};

export type TriageLevel = (typeof TriageLevel)[keyof typeof TriageLevel]


export const QueueState: {
  waiting: 'waiting',
  in_consult: 'in_consult',
  completed: 'completed',
  no_show: 'no_show',
  scheduled: 'scheduled'
};

export type QueueState = (typeof QueueState)[keyof typeof QueueState]


export const EncounterKind: {
  new: 'new',
  follow_up: 'follow_up',
  pediatrics: 'pediatrics',
  chronic: 'chronic',
  emergency: 'emergency'
};

export type EncounterKind = (typeof EncounterKind)[keyof typeof EncounterKind]


export const ConsultChannel: {
  video: 'video',
  audio: 'audio',
  chat: 'chat'
};

export type ConsultChannel = (typeof ConsultChannel)[keyof typeof ConsultChannel]


export const RelationshipRole: {
  self: 'self',
  child: 'child',
  parent: 'parent',
  spouse: 'spouse',
  dependent: 'dependent'
};

export type RelationshipRole = (typeof RelationshipRole)[keyof typeof RelationshipRole]

}

export type Sex = $Enums.Sex

export const Sex: typeof $Enums.Sex

export type TriageLevel = $Enums.TriageLevel

export const TriageLevel: typeof $Enums.TriageLevel

export type QueueState = $Enums.QueueState

export const QueueState: typeof $Enums.QueueState

export type EncounterKind = $Enums.EncounterKind

export const EncounterKind: typeof $Enums.EncounterKind

export type ConsultChannel = $Enums.ConsultChannel

export const ConsultChannel: typeof $Enums.ConsultChannel

export type RelationshipRole = $Enums.RelationshipRole

export const RelationshipRole: typeof $Enums.RelationshipRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.doctor`: Exposes CRUD operations for the **Doctor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Doctors
    * const doctors = await prisma.doctor.findMany()
    * ```
    */
  get doctor(): Prisma.DoctorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pharmacy`: Exposes CRUD operations for the **Pharmacy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pharmacies
    * const pharmacies = await prisma.pharmacy.findMany()
    * ```
    */
  get pharmacy(): Prisma.PharmacyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ariaHandover`: Exposes CRUD operations for the **AriaHandover** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AriaHandovers
    * const ariaHandovers = await prisma.ariaHandover.findMany()
    * ```
    */
  get ariaHandover(): Prisma.AriaHandoverDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.queueEntry`: Exposes CRUD operations for the **QueueEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QueueEntries
    * const queueEntries = await prisma.queueEntry.findMany()
    * ```
    */
  get queueEntry(): Prisma.QueueEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.encounter`: Exposes CRUD operations for the **Encounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Encounters
    * const encounters = await prisma.encounter.findMany()
    * ```
    */
  get encounter(): Prisma.EncounterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.consentGrant`: Exposes CRUD operations for the **ConsentGrant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConsentGrants
    * const consentGrants = await prisma.consentGrant.findMany()
    * ```
    */
  get consentGrant(): Prisma.ConsentGrantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditEvent`: Exposes CRUD operations for the **AuditEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditEvents
    * const auditEvents = await prisma.auditEvent.findMany()
    * ```
    */
  get auditEvent(): Prisma.AuditEventDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Doctor: 'Doctor',
    Pharmacy: 'Pharmacy',
    Patient: 'Patient',
    AriaHandover: 'AriaHandover',
    QueueEntry: 'QueueEntry',
    Encounter: 'Encounter',
    ConsentGrant: 'ConsentGrant',
    AuditEvent: 'AuditEvent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "doctor" | "pharmacy" | "patient" | "ariaHandover" | "queueEntry" | "encounter" | "consentGrant" | "auditEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Doctor: {
        payload: Prisma.$DoctorPayload<ExtArgs>
        fields: Prisma.DoctorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DoctorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DoctorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          findFirst: {
            args: Prisma.DoctorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DoctorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          findMany: {
            args: Prisma.DoctorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>[]
          }
          create: {
            args: Prisma.DoctorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          createMany: {
            args: Prisma.DoctorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DoctorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>[]
          }
          delete: {
            args: Prisma.DoctorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          update: {
            args: Prisma.DoctorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          deleteMany: {
            args: Prisma.DoctorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DoctorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DoctorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>[]
          }
          upsert: {
            args: Prisma.DoctorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          aggregate: {
            args: Prisma.DoctorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDoctor>
          }
          groupBy: {
            args: Prisma.DoctorGroupByArgs<ExtArgs>
            result: $Utils.Optional<DoctorGroupByOutputType>[]
          }
          count: {
            args: Prisma.DoctorCountArgs<ExtArgs>
            result: $Utils.Optional<DoctorCountAggregateOutputType> | number
          }
        }
      }
      Pharmacy: {
        payload: Prisma.$PharmacyPayload<ExtArgs>
        fields: Prisma.PharmacyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PharmacyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PharmacyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          findFirst: {
            args: Prisma.PharmacyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PharmacyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          findMany: {
            args: Prisma.PharmacyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>[]
          }
          create: {
            args: Prisma.PharmacyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          createMany: {
            args: Prisma.PharmacyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PharmacyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>[]
          }
          delete: {
            args: Prisma.PharmacyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          update: {
            args: Prisma.PharmacyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          deleteMany: {
            args: Prisma.PharmacyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PharmacyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PharmacyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>[]
          }
          upsert: {
            args: Prisma.PharmacyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PharmacyPayload>
          }
          aggregate: {
            args: Prisma.PharmacyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePharmacy>
          }
          groupBy: {
            args: Prisma.PharmacyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PharmacyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PharmacyCountArgs<ExtArgs>
            result: $Utils.Optional<PharmacyCountAggregateOutputType> | number
          }
        }
      }
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      AriaHandover: {
        payload: Prisma.$AriaHandoverPayload<ExtArgs>
        fields: Prisma.AriaHandoverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AriaHandoverFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AriaHandoverFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>
          }
          findFirst: {
            args: Prisma.AriaHandoverFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AriaHandoverFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>
          }
          findMany: {
            args: Prisma.AriaHandoverFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>[]
          }
          create: {
            args: Prisma.AriaHandoverCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>
          }
          createMany: {
            args: Prisma.AriaHandoverCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AriaHandoverCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>[]
          }
          delete: {
            args: Prisma.AriaHandoverDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>
          }
          update: {
            args: Prisma.AriaHandoverUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>
          }
          deleteMany: {
            args: Prisma.AriaHandoverDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AriaHandoverUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AriaHandoverUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>[]
          }
          upsert: {
            args: Prisma.AriaHandoverUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AriaHandoverPayload>
          }
          aggregate: {
            args: Prisma.AriaHandoverAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAriaHandover>
          }
          groupBy: {
            args: Prisma.AriaHandoverGroupByArgs<ExtArgs>
            result: $Utils.Optional<AriaHandoverGroupByOutputType>[]
          }
          count: {
            args: Prisma.AriaHandoverCountArgs<ExtArgs>
            result: $Utils.Optional<AriaHandoverCountAggregateOutputType> | number
          }
        }
      }
      QueueEntry: {
        payload: Prisma.$QueueEntryPayload<ExtArgs>
        fields: Prisma.QueueEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QueueEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QueueEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>
          }
          findFirst: {
            args: Prisma.QueueEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QueueEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>
          }
          findMany: {
            args: Prisma.QueueEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>[]
          }
          create: {
            args: Prisma.QueueEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>
          }
          createMany: {
            args: Prisma.QueueEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QueueEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>[]
          }
          delete: {
            args: Prisma.QueueEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>
          }
          update: {
            args: Prisma.QueueEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>
          }
          deleteMany: {
            args: Prisma.QueueEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QueueEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QueueEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>[]
          }
          upsert: {
            args: Prisma.QueueEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueueEntryPayload>
          }
          aggregate: {
            args: Prisma.QueueEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQueueEntry>
          }
          groupBy: {
            args: Prisma.QueueEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<QueueEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.QueueEntryCountArgs<ExtArgs>
            result: $Utils.Optional<QueueEntryCountAggregateOutputType> | number
          }
        }
      }
      Encounter: {
        payload: Prisma.$EncounterPayload<ExtArgs>
        fields: Prisma.EncounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EncounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EncounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findFirst: {
            args: Prisma.EncounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EncounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findMany: {
            args: Prisma.EncounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          create: {
            args: Prisma.EncounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          createMany: {
            args: Prisma.EncounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EncounterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          delete: {
            args: Prisma.EncounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          update: {
            args: Prisma.EncounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          deleteMany: {
            args: Prisma.EncounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EncounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EncounterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          upsert: {
            args: Prisma.EncounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          aggregate: {
            args: Prisma.EncounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEncounter>
          }
          groupBy: {
            args: Prisma.EncounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<EncounterGroupByOutputType>[]
          }
          count: {
            args: Prisma.EncounterCountArgs<ExtArgs>
            result: $Utils.Optional<EncounterCountAggregateOutputType> | number
          }
        }
      }
      ConsentGrant: {
        payload: Prisma.$ConsentGrantPayload<ExtArgs>
        fields: Prisma.ConsentGrantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsentGrantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsentGrantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>
          }
          findFirst: {
            args: Prisma.ConsentGrantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsentGrantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>
          }
          findMany: {
            args: Prisma.ConsentGrantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>[]
          }
          create: {
            args: Prisma.ConsentGrantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>
          }
          createMany: {
            args: Prisma.ConsentGrantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsentGrantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>[]
          }
          delete: {
            args: Prisma.ConsentGrantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>
          }
          update: {
            args: Prisma.ConsentGrantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>
          }
          deleteMany: {
            args: Prisma.ConsentGrantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsentGrantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConsentGrantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>[]
          }
          upsert: {
            args: Prisma.ConsentGrantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentGrantPayload>
          }
          aggregate: {
            args: Prisma.ConsentGrantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsentGrant>
          }
          groupBy: {
            args: Prisma.ConsentGrantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsentGrantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsentGrantCountArgs<ExtArgs>
            result: $Utils.Optional<ConsentGrantCountAggregateOutputType> | number
          }
        }
      }
      AuditEvent: {
        payload: Prisma.$AuditEventPayload<ExtArgs>
        fields: Prisma.AuditEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findFirst: {
            args: Prisma.AuditEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findMany: {
            args: Prisma.AuditEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          create: {
            args: Prisma.AuditEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          createMany: {
            args: Prisma.AuditEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          delete: {
            args: Prisma.AuditEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          update: {
            args: Prisma.AuditEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          deleteMany: {
            args: Prisma.AuditEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          upsert: {
            args: Prisma.AuditEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          aggregate: {
            args: Prisma.AuditEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditEvent>
          }
          groupBy: {
            args: Prisma.AuditEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditEventCountArgs<ExtArgs>
            result: $Utils.Optional<AuditEventCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    account?: AccountOmit
    doctor?: DoctorOmit
    pharmacy?: PharmacyOmit
    patient?: PatientOmit
    ariaHandover?: AriaHandoverOmit
    queueEntry?: QueueEntryOmit
    encounter?: EncounterOmit
    consentGrant?: ConsentGrantOmit
    auditEvent?: AuditEventOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AccountCountOutputType
   */

  export type AccountCountOutputType = {
    patients: number
  }

  export type AccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patients?: boolean | AccountCountOutputTypeCountPatientsArgs
  }

  // Custom InputTypes
  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AccountCountOutputType
     */
    select?: AccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AccountCountOutputType without action
   */
  export type AccountCountOutputTypeCountPatientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
  }


  /**
   * Count Type DoctorCountOutputType
   */

  export type DoctorCountOutputType = {
    queue: number
    encounters: number
    consents: number
    audits: number
  }

  export type DoctorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queue?: boolean | DoctorCountOutputTypeCountQueueArgs
    encounters?: boolean | DoctorCountOutputTypeCountEncountersArgs
    consents?: boolean | DoctorCountOutputTypeCountConsentsArgs
    audits?: boolean | DoctorCountOutputTypeCountAuditsArgs
  }

  // Custom InputTypes
  /**
   * DoctorCountOutputType without action
   */
  export type DoctorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorCountOutputType
     */
    select?: DoctorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DoctorCountOutputType without action
   */
  export type DoctorCountOutputTypeCountQueueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueueEntryWhereInput
  }

  /**
   * DoctorCountOutputType without action
   */
  export type DoctorCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }

  /**
   * DoctorCountOutputType without action
   */
  export type DoctorCountOutputTypeCountConsentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentGrantWhereInput
  }

  /**
   * DoctorCountOutputType without action
   */
  export type DoctorCountOutputTypeCountAuditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
  }


  /**
   * Count Type PatientCountOutputType
   */

  export type PatientCountOutputType = {
    handovers: number
    queueEntries: number
    encounters: number
    consents: number
  }

  export type PatientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    handovers?: boolean | PatientCountOutputTypeCountHandoversArgs
    queueEntries?: boolean | PatientCountOutputTypeCountQueueEntriesArgs
    encounters?: boolean | PatientCountOutputTypeCountEncountersArgs
    consents?: boolean | PatientCountOutputTypeCountConsentsArgs
  }

  // Custom InputTypes
  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     */
    select?: PatientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountHandoversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AriaHandoverWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountQueueEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueueEntryWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountConsentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentGrantWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    phone: string | null
    authUserId: string | null
    expoPushToken: string | null
    createdAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    authUserId: string | null
    expoPushToken: string | null
    createdAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    phone: number
    authUserId: number
    expoPushToken: number
    createdAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    phone?: true
    authUserId?: true
    expoPushToken?: true
    createdAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    phone?: true
    authUserId?: true
    expoPushToken?: true
    createdAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    phone?: true
    authUserId?: true
    expoPushToken?: true
    createdAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    phone: string
    authUserId: string | null
    expoPushToken: string | null
    createdAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    authUserId?: boolean
    expoPushToken?: boolean
    createdAt?: boolean
    patients?: boolean | Account$patientsArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    authUserId?: boolean
    expoPushToken?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    authUserId?: boolean
    expoPushToken?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    phone?: boolean
    authUserId?: boolean
    expoPushToken?: boolean
    createdAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "authUserId" | "expoPushToken" | "createdAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patients?: boolean | Account$patientsArgs<ExtArgs>
    _count?: boolean | AccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      patients: Prisma.$PatientPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string
      authUserId: string | null
      expoPushToken: string | null
      createdAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patients<T extends Account$patientsArgs<ExtArgs> = {}>(args?: Subset<T, Account$patientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly phone: FieldRef<"Account", 'String'>
    readonly authUserId: FieldRef<"Account", 'String'>
    readonly expoPushToken: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account.patients
   */
  export type Account$patientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    cursor?: PatientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Doctor
   */

  export type AggregateDoctor = {
    _count: DoctorCountAggregateOutputType | null
    _min: DoctorMinAggregateOutputType | null
    _max: DoctorMaxAggregateOutputType | null
  }

  export type DoctorMinAggregateOutputType = {
    id: string | null
    authUserId: string | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    specialty: string | null
    registrationNo: string | null
    clinicName: string | null
    mfaEnabled: boolean | null
    avatarTone: string | null
    onboardingComplete: boolean | null
    country: string | null
    onCall: boolean | null
    lastSeenAt: Date | null
    createdAt: Date | null
  }

  export type DoctorMaxAggregateOutputType = {
    id: string | null
    authUserId: string | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    specialty: string | null
    registrationNo: string | null
    clinicName: string | null
    mfaEnabled: boolean | null
    avatarTone: string | null
    onboardingComplete: boolean | null
    country: string | null
    onCall: boolean | null
    lastSeenAt: Date | null
    createdAt: Date | null
  }

  export type DoctorCountAggregateOutputType = {
    id: number
    authUserId: number
    fullName: number
    email: number
    passwordHash: number
    specialty: number
    registrationNo: number
    languages: number
    clinicName: number
    mfaEnabled: number
    avatarTone: number
    onboardingComplete: number
    country: number
    profile: number
    onCall: number
    lastSeenAt: number
    createdAt: number
    _all: number
  }


  export type DoctorMinAggregateInputType = {
    id?: true
    authUserId?: true
    fullName?: true
    email?: true
    passwordHash?: true
    specialty?: true
    registrationNo?: true
    clinicName?: true
    mfaEnabled?: true
    avatarTone?: true
    onboardingComplete?: true
    country?: true
    onCall?: true
    lastSeenAt?: true
    createdAt?: true
  }

  export type DoctorMaxAggregateInputType = {
    id?: true
    authUserId?: true
    fullName?: true
    email?: true
    passwordHash?: true
    specialty?: true
    registrationNo?: true
    clinicName?: true
    mfaEnabled?: true
    avatarTone?: true
    onboardingComplete?: true
    country?: true
    onCall?: true
    lastSeenAt?: true
    createdAt?: true
  }

  export type DoctorCountAggregateInputType = {
    id?: true
    authUserId?: true
    fullName?: true
    email?: true
    passwordHash?: true
    specialty?: true
    registrationNo?: true
    languages?: true
    clinicName?: true
    mfaEnabled?: true
    avatarTone?: true
    onboardingComplete?: true
    country?: true
    profile?: true
    onCall?: true
    lastSeenAt?: true
    createdAt?: true
    _all?: true
  }

  export type DoctorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Doctor to aggregate.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Doctors
    **/
    _count?: true | DoctorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DoctorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DoctorMaxAggregateInputType
  }

  export type GetDoctorAggregateType<T extends DoctorAggregateArgs> = {
        [P in keyof T & keyof AggregateDoctor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDoctor[P]>
      : GetScalarType<T[P], AggregateDoctor[P]>
  }




  export type DoctorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DoctorWhereInput
    orderBy?: DoctorOrderByWithAggregationInput | DoctorOrderByWithAggregationInput[]
    by: DoctorScalarFieldEnum[] | DoctorScalarFieldEnum
    having?: DoctorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DoctorCountAggregateInputType | true
    _min?: DoctorMinAggregateInputType
    _max?: DoctorMaxAggregateInputType
  }

  export type DoctorGroupByOutputType = {
    id: string
    authUserId: string | null
    fullName: string
    email: string
    passwordHash: string | null
    specialty: string
    registrationNo: string
    languages: string[]
    clinicName: string
    mfaEnabled: boolean
    avatarTone: string | null
    onboardingComplete: boolean
    country: string | null
    profile: JsonValue | null
    onCall: boolean
    lastSeenAt: Date | null
    createdAt: Date
    _count: DoctorCountAggregateOutputType | null
    _min: DoctorMinAggregateOutputType | null
    _max: DoctorMaxAggregateOutputType | null
  }

  type GetDoctorGroupByPayload<T extends DoctorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DoctorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DoctorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DoctorGroupByOutputType[P]>
            : GetScalarType<T[P], DoctorGroupByOutputType[P]>
        }
      >
    >


  export type DoctorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    specialty?: boolean
    registrationNo?: boolean
    languages?: boolean
    clinicName?: boolean
    mfaEnabled?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    country?: boolean
    profile?: boolean
    onCall?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    queue?: boolean | Doctor$queueArgs<ExtArgs>
    encounters?: boolean | Doctor$encountersArgs<ExtArgs>
    consents?: boolean | Doctor$consentsArgs<ExtArgs>
    audits?: boolean | Doctor$auditsArgs<ExtArgs>
    _count?: boolean | DoctorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["doctor"]>

  export type DoctorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    specialty?: boolean
    registrationNo?: boolean
    languages?: boolean
    clinicName?: boolean
    mfaEnabled?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    country?: boolean
    profile?: boolean
    onCall?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["doctor"]>

  export type DoctorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    specialty?: boolean
    registrationNo?: boolean
    languages?: boolean
    clinicName?: boolean
    mfaEnabled?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    country?: boolean
    profile?: boolean
    onCall?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["doctor"]>

  export type DoctorSelectScalar = {
    id?: boolean
    authUserId?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    specialty?: boolean
    registrationNo?: boolean
    languages?: boolean
    clinicName?: boolean
    mfaEnabled?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    country?: boolean
    profile?: boolean
    onCall?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
  }

  export type DoctorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authUserId" | "fullName" | "email" | "passwordHash" | "specialty" | "registrationNo" | "languages" | "clinicName" | "mfaEnabled" | "avatarTone" | "onboardingComplete" | "country" | "profile" | "onCall" | "lastSeenAt" | "createdAt", ExtArgs["result"]["doctor"]>
  export type DoctorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queue?: boolean | Doctor$queueArgs<ExtArgs>
    encounters?: boolean | Doctor$encountersArgs<ExtArgs>
    consents?: boolean | Doctor$consentsArgs<ExtArgs>
    audits?: boolean | Doctor$auditsArgs<ExtArgs>
    _count?: boolean | DoctorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DoctorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DoctorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DoctorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Doctor"
    objects: {
      queue: Prisma.$QueueEntryPayload<ExtArgs>[]
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
      consents: Prisma.$ConsentGrantPayload<ExtArgs>[]
      audits: Prisma.$AuditEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authUserId: string | null
      fullName: string
      email: string
      passwordHash: string | null
      specialty: string
      registrationNo: string
      languages: string[]
      clinicName: string
      mfaEnabled: boolean
      avatarTone: string | null
      onboardingComplete: boolean
      country: string | null
      profile: Prisma.JsonValue | null
      onCall: boolean
      lastSeenAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["doctor"]>
    composites: {}
  }

  type DoctorGetPayload<S extends boolean | null | undefined | DoctorDefaultArgs> = $Result.GetResult<Prisma.$DoctorPayload, S>

  type DoctorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DoctorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DoctorCountAggregateInputType | true
    }

  export interface DoctorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Doctor'], meta: { name: 'Doctor' } }
    /**
     * Find zero or one Doctor that matches the filter.
     * @param {DoctorFindUniqueArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DoctorFindUniqueArgs>(args: SelectSubset<T, DoctorFindUniqueArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Doctor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DoctorFindUniqueOrThrowArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DoctorFindUniqueOrThrowArgs>(args: SelectSubset<T, DoctorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Doctor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorFindFirstArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DoctorFindFirstArgs>(args?: SelectSubset<T, DoctorFindFirstArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Doctor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorFindFirstOrThrowArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DoctorFindFirstOrThrowArgs>(args?: SelectSubset<T, DoctorFindFirstOrThrowArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Doctors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Doctors
     * const doctors = await prisma.doctor.findMany()
     * 
     * // Get first 10 Doctors
     * const doctors = await prisma.doctor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const doctorWithIdOnly = await prisma.doctor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DoctorFindManyArgs>(args?: SelectSubset<T, DoctorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Doctor.
     * @param {DoctorCreateArgs} args - Arguments to create a Doctor.
     * @example
     * // Create one Doctor
     * const Doctor = await prisma.doctor.create({
     *   data: {
     *     // ... data to create a Doctor
     *   }
     * })
     * 
     */
    create<T extends DoctorCreateArgs>(args: SelectSubset<T, DoctorCreateArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Doctors.
     * @param {DoctorCreateManyArgs} args - Arguments to create many Doctors.
     * @example
     * // Create many Doctors
     * const doctor = await prisma.doctor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DoctorCreateManyArgs>(args?: SelectSubset<T, DoctorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Doctors and returns the data saved in the database.
     * @param {DoctorCreateManyAndReturnArgs} args - Arguments to create many Doctors.
     * @example
     * // Create many Doctors
     * const doctor = await prisma.doctor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Doctors and only return the `id`
     * const doctorWithIdOnly = await prisma.doctor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DoctorCreateManyAndReturnArgs>(args?: SelectSubset<T, DoctorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Doctor.
     * @param {DoctorDeleteArgs} args - Arguments to delete one Doctor.
     * @example
     * // Delete one Doctor
     * const Doctor = await prisma.doctor.delete({
     *   where: {
     *     // ... filter to delete one Doctor
     *   }
     * })
     * 
     */
    delete<T extends DoctorDeleteArgs>(args: SelectSubset<T, DoctorDeleteArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Doctor.
     * @param {DoctorUpdateArgs} args - Arguments to update one Doctor.
     * @example
     * // Update one Doctor
     * const doctor = await prisma.doctor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DoctorUpdateArgs>(args: SelectSubset<T, DoctorUpdateArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Doctors.
     * @param {DoctorDeleteManyArgs} args - Arguments to filter Doctors to delete.
     * @example
     * // Delete a few Doctors
     * const { count } = await prisma.doctor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DoctorDeleteManyArgs>(args?: SelectSubset<T, DoctorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Doctors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Doctors
     * const doctor = await prisma.doctor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DoctorUpdateManyArgs>(args: SelectSubset<T, DoctorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Doctors and returns the data updated in the database.
     * @param {DoctorUpdateManyAndReturnArgs} args - Arguments to update many Doctors.
     * @example
     * // Update many Doctors
     * const doctor = await prisma.doctor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Doctors and only return the `id`
     * const doctorWithIdOnly = await prisma.doctor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DoctorUpdateManyAndReturnArgs>(args: SelectSubset<T, DoctorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Doctor.
     * @param {DoctorUpsertArgs} args - Arguments to update or create a Doctor.
     * @example
     * // Update or create a Doctor
     * const doctor = await prisma.doctor.upsert({
     *   create: {
     *     // ... data to create a Doctor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Doctor we want to update
     *   }
     * })
     */
    upsert<T extends DoctorUpsertArgs>(args: SelectSubset<T, DoctorUpsertArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Doctors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorCountArgs} args - Arguments to filter Doctors to count.
     * @example
     * // Count the number of Doctors
     * const count = await prisma.doctor.count({
     *   where: {
     *     // ... the filter for the Doctors we want to count
     *   }
     * })
    **/
    count<T extends DoctorCountArgs>(
      args?: Subset<T, DoctorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DoctorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Doctor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DoctorAggregateArgs>(args: Subset<T, DoctorAggregateArgs>): Prisma.PrismaPromise<GetDoctorAggregateType<T>>

    /**
     * Group by Doctor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DoctorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DoctorGroupByArgs['orderBy'] }
        : { orderBy?: DoctorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DoctorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDoctorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Doctor model
   */
  readonly fields: DoctorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Doctor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DoctorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    queue<T extends Doctor$queueArgs<ExtArgs> = {}>(args?: Subset<T, Doctor$queueArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    encounters<T extends Doctor$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Doctor$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    consents<T extends Doctor$consentsArgs<ExtArgs> = {}>(args?: Subset<T, Doctor$consentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    audits<T extends Doctor$auditsArgs<ExtArgs> = {}>(args?: Subset<T, Doctor$auditsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Doctor model
   */
  interface DoctorFieldRefs {
    readonly id: FieldRef<"Doctor", 'String'>
    readonly authUserId: FieldRef<"Doctor", 'String'>
    readonly fullName: FieldRef<"Doctor", 'String'>
    readonly email: FieldRef<"Doctor", 'String'>
    readonly passwordHash: FieldRef<"Doctor", 'String'>
    readonly specialty: FieldRef<"Doctor", 'String'>
    readonly registrationNo: FieldRef<"Doctor", 'String'>
    readonly languages: FieldRef<"Doctor", 'String[]'>
    readonly clinicName: FieldRef<"Doctor", 'String'>
    readonly mfaEnabled: FieldRef<"Doctor", 'Boolean'>
    readonly avatarTone: FieldRef<"Doctor", 'String'>
    readonly onboardingComplete: FieldRef<"Doctor", 'Boolean'>
    readonly country: FieldRef<"Doctor", 'String'>
    readonly profile: FieldRef<"Doctor", 'Json'>
    readonly onCall: FieldRef<"Doctor", 'Boolean'>
    readonly lastSeenAt: FieldRef<"Doctor", 'DateTime'>
    readonly createdAt: FieldRef<"Doctor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Doctor findUnique
   */
  export type DoctorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor findUniqueOrThrow
   */
  export type DoctorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor findFirst
   */
  export type DoctorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Doctors.
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Doctors.
     */
    distinct?: DoctorScalarFieldEnum | DoctorScalarFieldEnum[]
  }

  /**
   * Doctor findFirstOrThrow
   */
  export type DoctorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Doctors.
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Doctors.
     */
    distinct?: DoctorScalarFieldEnum | DoctorScalarFieldEnum[]
  }

  /**
   * Doctor findMany
   */
  export type DoctorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctors to fetch.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Doctors.
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    distinct?: DoctorScalarFieldEnum | DoctorScalarFieldEnum[]
  }

  /**
   * Doctor create
   */
  export type DoctorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * The data needed to create a Doctor.
     */
    data: XOR<DoctorCreateInput, DoctorUncheckedCreateInput>
  }

  /**
   * Doctor createMany
   */
  export type DoctorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Doctors.
     */
    data: DoctorCreateManyInput | DoctorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Doctor createManyAndReturn
   */
  export type DoctorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * The data used to create many Doctors.
     */
    data: DoctorCreateManyInput | DoctorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Doctor update
   */
  export type DoctorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * The data needed to update a Doctor.
     */
    data: XOR<DoctorUpdateInput, DoctorUncheckedUpdateInput>
    /**
     * Choose, which Doctor to update.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor updateMany
   */
  export type DoctorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Doctors.
     */
    data: XOR<DoctorUpdateManyMutationInput, DoctorUncheckedUpdateManyInput>
    /**
     * Filter which Doctors to update
     */
    where?: DoctorWhereInput
    /**
     * Limit how many Doctors to update.
     */
    limit?: number
  }

  /**
   * Doctor updateManyAndReturn
   */
  export type DoctorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * The data used to update Doctors.
     */
    data: XOR<DoctorUpdateManyMutationInput, DoctorUncheckedUpdateManyInput>
    /**
     * Filter which Doctors to update
     */
    where?: DoctorWhereInput
    /**
     * Limit how many Doctors to update.
     */
    limit?: number
  }

  /**
   * Doctor upsert
   */
  export type DoctorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * The filter to search for the Doctor to update in case it exists.
     */
    where: DoctorWhereUniqueInput
    /**
     * In case the Doctor found by the `where` argument doesn't exist, create a new Doctor with this data.
     */
    create: XOR<DoctorCreateInput, DoctorUncheckedCreateInput>
    /**
     * In case the Doctor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DoctorUpdateInput, DoctorUncheckedUpdateInput>
  }

  /**
   * Doctor delete
   */
  export type DoctorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter which Doctor to delete.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor deleteMany
   */
  export type DoctorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Doctors to delete
     */
    where?: DoctorWhereInput
    /**
     * Limit how many Doctors to delete.
     */
    limit?: number
  }

  /**
   * Doctor.queue
   */
  export type Doctor$queueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    where?: QueueEntryWhereInput
    orderBy?: QueueEntryOrderByWithRelationInput | QueueEntryOrderByWithRelationInput[]
    cursor?: QueueEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QueueEntryScalarFieldEnum | QueueEntryScalarFieldEnum[]
  }

  /**
   * Doctor.encounters
   */
  export type Doctor$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Doctor.consents
   */
  export type Doctor$consentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    where?: ConsentGrantWhereInput
    orderBy?: ConsentGrantOrderByWithRelationInput | ConsentGrantOrderByWithRelationInput[]
    cursor?: ConsentGrantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConsentGrantScalarFieldEnum | ConsentGrantScalarFieldEnum[]
  }

  /**
   * Doctor.audits
   */
  export type Doctor$auditsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    cursor?: AuditEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * Doctor without action
   */
  export type DoctorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
  }


  /**
   * Model Pharmacy
   */

  export type AggregatePharmacy = {
    _count: PharmacyCountAggregateOutputType | null
    _min: PharmacyMinAggregateOutputType | null
    _max: PharmacyMaxAggregateOutputType | null
  }

  export type PharmacyMinAggregateOutputType = {
    id: string | null
    authUserId: string | null
    name: string | null
    email: string | null
    licenseNo: string | null
    ownerName: string | null
    phone: string | null
    city: string | null
    district: string | null
    state: string | null
    country: string | null
    avatarTone: string | null
    onboardingComplete: boolean | null
    verified: boolean | null
    createdAt: Date | null
  }

  export type PharmacyMaxAggregateOutputType = {
    id: string | null
    authUserId: string | null
    name: string | null
    email: string | null
    licenseNo: string | null
    ownerName: string | null
    phone: string | null
    city: string | null
    district: string | null
    state: string | null
    country: string | null
    avatarTone: string | null
    onboardingComplete: boolean | null
    verified: boolean | null
    createdAt: Date | null
  }

  export type PharmacyCountAggregateOutputType = {
    id: number
    authUserId: number
    name: number
    email: number
    licenseNo: number
    ownerName: number
    phone: number
    city: number
    district: number
    state: number
    country: number
    services: number
    avatarTone: number
    onboardingComplete: number
    verified: number
    profile: number
    createdAt: number
    _all: number
  }


  export type PharmacyMinAggregateInputType = {
    id?: true
    authUserId?: true
    name?: true
    email?: true
    licenseNo?: true
    ownerName?: true
    phone?: true
    city?: true
    district?: true
    state?: true
    country?: true
    avatarTone?: true
    onboardingComplete?: true
    verified?: true
    createdAt?: true
  }

  export type PharmacyMaxAggregateInputType = {
    id?: true
    authUserId?: true
    name?: true
    email?: true
    licenseNo?: true
    ownerName?: true
    phone?: true
    city?: true
    district?: true
    state?: true
    country?: true
    avatarTone?: true
    onboardingComplete?: true
    verified?: true
    createdAt?: true
  }

  export type PharmacyCountAggregateInputType = {
    id?: true
    authUserId?: true
    name?: true
    email?: true
    licenseNo?: true
    ownerName?: true
    phone?: true
    city?: true
    district?: true
    state?: true
    country?: true
    services?: true
    avatarTone?: true
    onboardingComplete?: true
    verified?: true
    profile?: true
    createdAt?: true
    _all?: true
  }

  export type PharmacyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pharmacy to aggregate.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pharmacies
    **/
    _count?: true | PharmacyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PharmacyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PharmacyMaxAggregateInputType
  }

  export type GetPharmacyAggregateType<T extends PharmacyAggregateArgs> = {
        [P in keyof T & keyof AggregatePharmacy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePharmacy[P]>
      : GetScalarType<T[P], AggregatePharmacy[P]>
  }




  export type PharmacyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PharmacyWhereInput
    orderBy?: PharmacyOrderByWithAggregationInput | PharmacyOrderByWithAggregationInput[]
    by: PharmacyScalarFieldEnum[] | PharmacyScalarFieldEnum
    having?: PharmacyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PharmacyCountAggregateInputType | true
    _min?: PharmacyMinAggregateInputType
    _max?: PharmacyMaxAggregateInputType
  }

  export type PharmacyGroupByOutputType = {
    id: string
    authUserId: string | null
    name: string
    email: string
    licenseNo: string
    ownerName: string
    phone: string | null
    city: string | null
    district: string | null
    state: string | null
    country: string | null
    services: string[]
    avatarTone: string | null
    onboardingComplete: boolean
    verified: boolean
    profile: JsonValue | null
    createdAt: Date
    _count: PharmacyCountAggregateOutputType | null
    _min: PharmacyMinAggregateOutputType | null
    _max: PharmacyMaxAggregateOutputType | null
  }

  type GetPharmacyGroupByPayload<T extends PharmacyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PharmacyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PharmacyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PharmacyGroupByOutputType[P]>
            : GetScalarType<T[P], PharmacyGroupByOutputType[P]>
        }
      >
    >


  export type PharmacySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    name?: boolean
    email?: boolean
    licenseNo?: boolean
    ownerName?: boolean
    phone?: boolean
    city?: boolean
    district?: boolean
    state?: boolean
    country?: boolean
    services?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    verified?: boolean
    profile?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pharmacy"]>

  export type PharmacySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    name?: boolean
    email?: boolean
    licenseNo?: boolean
    ownerName?: boolean
    phone?: boolean
    city?: boolean
    district?: boolean
    state?: boolean
    country?: boolean
    services?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    verified?: boolean
    profile?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pharmacy"]>

  export type PharmacySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authUserId?: boolean
    name?: boolean
    email?: boolean
    licenseNo?: boolean
    ownerName?: boolean
    phone?: boolean
    city?: boolean
    district?: boolean
    state?: boolean
    country?: boolean
    services?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    verified?: boolean
    profile?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pharmacy"]>

  export type PharmacySelectScalar = {
    id?: boolean
    authUserId?: boolean
    name?: boolean
    email?: boolean
    licenseNo?: boolean
    ownerName?: boolean
    phone?: boolean
    city?: boolean
    district?: boolean
    state?: boolean
    country?: boolean
    services?: boolean
    avatarTone?: boolean
    onboardingComplete?: boolean
    verified?: boolean
    profile?: boolean
    createdAt?: boolean
  }

  export type PharmacyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authUserId" | "name" | "email" | "licenseNo" | "ownerName" | "phone" | "city" | "district" | "state" | "country" | "services" | "avatarTone" | "onboardingComplete" | "verified" | "profile" | "createdAt", ExtArgs["result"]["pharmacy"]>

  export type $PharmacyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pharmacy"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authUserId: string | null
      name: string
      email: string
      licenseNo: string
      ownerName: string
      phone: string | null
      city: string | null
      district: string | null
      state: string | null
      country: string | null
      services: string[]
      avatarTone: string | null
      onboardingComplete: boolean
      verified: boolean
      /**
       * Full onboarding payload (country-aware fields + document paths).
       */
      profile: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["pharmacy"]>
    composites: {}
  }

  type PharmacyGetPayload<S extends boolean | null | undefined | PharmacyDefaultArgs> = $Result.GetResult<Prisma.$PharmacyPayload, S>

  type PharmacyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PharmacyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PharmacyCountAggregateInputType | true
    }

  export interface PharmacyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pharmacy'], meta: { name: 'Pharmacy' } }
    /**
     * Find zero or one Pharmacy that matches the filter.
     * @param {PharmacyFindUniqueArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PharmacyFindUniqueArgs>(args: SelectSubset<T, PharmacyFindUniqueArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pharmacy that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PharmacyFindUniqueOrThrowArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PharmacyFindUniqueOrThrowArgs>(args: SelectSubset<T, PharmacyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pharmacy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyFindFirstArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PharmacyFindFirstArgs>(args?: SelectSubset<T, PharmacyFindFirstArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pharmacy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyFindFirstOrThrowArgs} args - Arguments to find a Pharmacy
     * @example
     * // Get one Pharmacy
     * const pharmacy = await prisma.pharmacy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PharmacyFindFirstOrThrowArgs>(args?: SelectSubset<T, PharmacyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pharmacies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pharmacies
     * const pharmacies = await prisma.pharmacy.findMany()
     * 
     * // Get first 10 Pharmacies
     * const pharmacies = await prisma.pharmacy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pharmacyWithIdOnly = await prisma.pharmacy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PharmacyFindManyArgs>(args?: SelectSubset<T, PharmacyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pharmacy.
     * @param {PharmacyCreateArgs} args - Arguments to create a Pharmacy.
     * @example
     * // Create one Pharmacy
     * const Pharmacy = await prisma.pharmacy.create({
     *   data: {
     *     // ... data to create a Pharmacy
     *   }
     * })
     * 
     */
    create<T extends PharmacyCreateArgs>(args: SelectSubset<T, PharmacyCreateArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pharmacies.
     * @param {PharmacyCreateManyArgs} args - Arguments to create many Pharmacies.
     * @example
     * // Create many Pharmacies
     * const pharmacy = await prisma.pharmacy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PharmacyCreateManyArgs>(args?: SelectSubset<T, PharmacyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pharmacies and returns the data saved in the database.
     * @param {PharmacyCreateManyAndReturnArgs} args - Arguments to create many Pharmacies.
     * @example
     * // Create many Pharmacies
     * const pharmacy = await prisma.pharmacy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pharmacies and only return the `id`
     * const pharmacyWithIdOnly = await prisma.pharmacy.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PharmacyCreateManyAndReturnArgs>(args?: SelectSubset<T, PharmacyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pharmacy.
     * @param {PharmacyDeleteArgs} args - Arguments to delete one Pharmacy.
     * @example
     * // Delete one Pharmacy
     * const Pharmacy = await prisma.pharmacy.delete({
     *   where: {
     *     // ... filter to delete one Pharmacy
     *   }
     * })
     * 
     */
    delete<T extends PharmacyDeleteArgs>(args: SelectSubset<T, PharmacyDeleteArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pharmacy.
     * @param {PharmacyUpdateArgs} args - Arguments to update one Pharmacy.
     * @example
     * // Update one Pharmacy
     * const pharmacy = await prisma.pharmacy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PharmacyUpdateArgs>(args: SelectSubset<T, PharmacyUpdateArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pharmacies.
     * @param {PharmacyDeleteManyArgs} args - Arguments to filter Pharmacies to delete.
     * @example
     * // Delete a few Pharmacies
     * const { count } = await prisma.pharmacy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PharmacyDeleteManyArgs>(args?: SelectSubset<T, PharmacyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pharmacies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pharmacies
     * const pharmacy = await prisma.pharmacy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PharmacyUpdateManyArgs>(args: SelectSubset<T, PharmacyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pharmacies and returns the data updated in the database.
     * @param {PharmacyUpdateManyAndReturnArgs} args - Arguments to update many Pharmacies.
     * @example
     * // Update many Pharmacies
     * const pharmacy = await prisma.pharmacy.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pharmacies and only return the `id`
     * const pharmacyWithIdOnly = await prisma.pharmacy.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PharmacyUpdateManyAndReturnArgs>(args: SelectSubset<T, PharmacyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pharmacy.
     * @param {PharmacyUpsertArgs} args - Arguments to update or create a Pharmacy.
     * @example
     * // Update or create a Pharmacy
     * const pharmacy = await prisma.pharmacy.upsert({
     *   create: {
     *     // ... data to create a Pharmacy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pharmacy we want to update
     *   }
     * })
     */
    upsert<T extends PharmacyUpsertArgs>(args: SelectSubset<T, PharmacyUpsertArgs<ExtArgs>>): Prisma__PharmacyClient<$Result.GetResult<Prisma.$PharmacyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pharmacies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyCountArgs} args - Arguments to filter Pharmacies to count.
     * @example
     * // Count the number of Pharmacies
     * const count = await prisma.pharmacy.count({
     *   where: {
     *     // ... the filter for the Pharmacies we want to count
     *   }
     * })
    **/
    count<T extends PharmacyCountArgs>(
      args?: Subset<T, PharmacyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PharmacyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pharmacy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PharmacyAggregateArgs>(args: Subset<T, PharmacyAggregateArgs>): Prisma.PrismaPromise<GetPharmacyAggregateType<T>>

    /**
     * Group by Pharmacy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PharmacyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PharmacyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PharmacyGroupByArgs['orderBy'] }
        : { orderBy?: PharmacyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PharmacyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPharmacyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pharmacy model
   */
  readonly fields: PharmacyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pharmacy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PharmacyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pharmacy model
   */
  interface PharmacyFieldRefs {
    readonly id: FieldRef<"Pharmacy", 'String'>
    readonly authUserId: FieldRef<"Pharmacy", 'String'>
    readonly name: FieldRef<"Pharmacy", 'String'>
    readonly email: FieldRef<"Pharmacy", 'String'>
    readonly licenseNo: FieldRef<"Pharmacy", 'String'>
    readonly ownerName: FieldRef<"Pharmacy", 'String'>
    readonly phone: FieldRef<"Pharmacy", 'String'>
    readonly city: FieldRef<"Pharmacy", 'String'>
    readonly district: FieldRef<"Pharmacy", 'String'>
    readonly state: FieldRef<"Pharmacy", 'String'>
    readonly country: FieldRef<"Pharmacy", 'String'>
    readonly services: FieldRef<"Pharmacy", 'String[]'>
    readonly avatarTone: FieldRef<"Pharmacy", 'String'>
    readonly onboardingComplete: FieldRef<"Pharmacy", 'Boolean'>
    readonly verified: FieldRef<"Pharmacy", 'Boolean'>
    readonly profile: FieldRef<"Pharmacy", 'Json'>
    readonly createdAt: FieldRef<"Pharmacy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Pharmacy findUnique
   */
  export type PharmacyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy findUniqueOrThrow
   */
  export type PharmacyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy findFirst
   */
  export type PharmacyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pharmacies.
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pharmacies.
     */
    distinct?: PharmacyScalarFieldEnum | PharmacyScalarFieldEnum[]
  }

  /**
   * Pharmacy findFirstOrThrow
   */
  export type PharmacyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * Filter, which Pharmacy to fetch.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pharmacies.
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pharmacies.
     */
    distinct?: PharmacyScalarFieldEnum | PharmacyScalarFieldEnum[]
  }

  /**
   * Pharmacy findMany
   */
  export type PharmacyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * Filter, which Pharmacies to fetch.
     */
    where?: PharmacyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pharmacies to fetch.
     */
    orderBy?: PharmacyOrderByWithRelationInput | PharmacyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pharmacies.
     */
    cursor?: PharmacyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pharmacies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pharmacies.
     */
    skip?: number
    distinct?: PharmacyScalarFieldEnum | PharmacyScalarFieldEnum[]
  }

  /**
   * Pharmacy create
   */
  export type PharmacyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * The data needed to create a Pharmacy.
     */
    data: XOR<PharmacyCreateInput, PharmacyUncheckedCreateInput>
  }

  /**
   * Pharmacy createMany
   */
  export type PharmacyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pharmacies.
     */
    data: PharmacyCreateManyInput | PharmacyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pharmacy createManyAndReturn
   */
  export type PharmacyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * The data used to create many Pharmacies.
     */
    data: PharmacyCreateManyInput | PharmacyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pharmacy update
   */
  export type PharmacyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * The data needed to update a Pharmacy.
     */
    data: XOR<PharmacyUpdateInput, PharmacyUncheckedUpdateInput>
    /**
     * Choose, which Pharmacy to update.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy updateMany
   */
  export type PharmacyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pharmacies.
     */
    data: XOR<PharmacyUpdateManyMutationInput, PharmacyUncheckedUpdateManyInput>
    /**
     * Filter which Pharmacies to update
     */
    where?: PharmacyWhereInput
    /**
     * Limit how many Pharmacies to update.
     */
    limit?: number
  }

  /**
   * Pharmacy updateManyAndReturn
   */
  export type PharmacyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * The data used to update Pharmacies.
     */
    data: XOR<PharmacyUpdateManyMutationInput, PharmacyUncheckedUpdateManyInput>
    /**
     * Filter which Pharmacies to update
     */
    where?: PharmacyWhereInput
    /**
     * Limit how many Pharmacies to update.
     */
    limit?: number
  }

  /**
   * Pharmacy upsert
   */
  export type PharmacyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * The filter to search for the Pharmacy to update in case it exists.
     */
    where: PharmacyWhereUniqueInput
    /**
     * In case the Pharmacy found by the `where` argument doesn't exist, create a new Pharmacy with this data.
     */
    create: XOR<PharmacyCreateInput, PharmacyUncheckedCreateInput>
    /**
     * In case the Pharmacy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PharmacyUpdateInput, PharmacyUncheckedUpdateInput>
  }

  /**
   * Pharmacy delete
   */
  export type PharmacyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
    /**
     * Filter which Pharmacy to delete.
     */
    where: PharmacyWhereUniqueInput
  }

  /**
   * Pharmacy deleteMany
   */
  export type PharmacyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pharmacies to delete
     */
    where?: PharmacyWhereInput
    /**
     * Limit how many Pharmacies to delete.
     */
    limit?: number
  }

  /**
   * Pharmacy without action
   */
  export type PharmacyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pharmacy
     */
    select?: PharmacySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pharmacy
     */
    omit?: PharmacyOmit<ExtArgs> | null
  }


  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    fullName: string | null
    sex: $Enums.Sex | null
    dateOfBirth: Date | null
    phoneMasked: string | null
    village: string | null
    district: string | null
    preferredLanguage: string | null
    abhaLinked: boolean | null
    relationshipToAccount: $Enums.RelationshipRole | null
    avatarTone: string | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    fullName: string | null
    sex: $Enums.Sex | null
    dateOfBirth: Date | null
    phoneMasked: string | null
    village: string | null
    district: string | null
    preferredLanguage: string | null
    abhaLinked: boolean | null
    relationshipToAccount: $Enums.RelationshipRole | null
    avatarTone: string | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    accountId: number
    fullName: number
    sex: number
    dateOfBirth: number
    phoneMasked: number
    village: number
    district: number
    preferredLanguage: number
    abhaLinked: number
    relationshipToAccount: number
    allergies: number
    conditions: number
    currentMedications: number
    avatarTone: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    accountId?: true
    fullName?: true
    sex?: true
    dateOfBirth?: true
    phoneMasked?: true
    village?: true
    district?: true
    preferredLanguage?: true
    abhaLinked?: true
    relationshipToAccount?: true
    avatarTone?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    accountId?: true
    fullName?: true
    sex?: true
    dateOfBirth?: true
    phoneMasked?: true
    village?: true
    district?: true
    preferredLanguage?: true
    abhaLinked?: true
    relationshipToAccount?: true
    avatarTone?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    accountId?: true
    fullName?: true
    sex?: true
    dateOfBirth?: true
    phoneMasked?: true
    village?: true
    district?: true
    preferredLanguage?: true
    abhaLinked?: true
    relationshipToAccount?: true
    allergies?: true
    conditions?: true
    currentMedications?: true
    avatarTone?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    accountId: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies: string[]
    conditions: string[]
    currentMedications: string[]
    avatarTone: string | null
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    fullName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    phoneMasked?: boolean
    village?: boolean
    district?: boolean
    preferredLanguage?: boolean
    abhaLinked?: boolean
    relationshipToAccount?: boolean
    allergies?: boolean
    conditions?: boolean
    currentMedications?: boolean
    avatarTone?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
    handovers?: boolean | Patient$handoversArgs<ExtArgs>
    queueEntries?: boolean | Patient$queueEntriesArgs<ExtArgs>
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    consents?: boolean | Patient$consentsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    fullName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    phoneMasked?: boolean
    village?: boolean
    district?: boolean
    preferredLanguage?: boolean
    abhaLinked?: boolean
    relationshipToAccount?: boolean
    allergies?: boolean
    conditions?: boolean
    currentMedications?: boolean
    avatarTone?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    fullName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    phoneMasked?: boolean
    village?: boolean
    district?: boolean
    preferredLanguage?: boolean
    abhaLinked?: boolean
    relationshipToAccount?: boolean
    allergies?: boolean
    conditions?: boolean
    currentMedications?: boolean
    avatarTone?: boolean
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    accountId?: boolean
    fullName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    phoneMasked?: boolean
    village?: boolean
    district?: boolean
    preferredLanguage?: boolean
    abhaLinked?: boolean
    relationshipToAccount?: boolean
    allergies?: boolean
    conditions?: boolean
    currentMedications?: boolean
    avatarTone?: boolean
  }

  export type PatientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "fullName" | "sex" | "dateOfBirth" | "phoneMasked" | "village" | "district" | "preferredLanguage" | "abhaLinked" | "relationshipToAccount" | "allergies" | "conditions" | "currentMedications" | "avatarTone", ExtArgs["result"]["patient"]>
  export type PatientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
    handovers?: boolean | Patient$handoversArgs<ExtArgs>
    queueEntries?: boolean | Patient$queueEntriesArgs<ExtArgs>
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    consents?: boolean | Patient$consentsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }
  export type PatientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    account?: boolean | AccountDefaultArgs<ExtArgs>
  }

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {
      account: Prisma.$AccountPayload<ExtArgs>
      handovers: Prisma.$AriaHandoverPayload<ExtArgs>[]
      queueEntries: Prisma.$QueueEntryPayload<ExtArgs>[]
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
      consents: Prisma.$ConsentGrantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      fullName: string
      sex: $Enums.Sex
      dateOfBirth: Date
      phoneMasked: string
      village: string
      district: string
      preferredLanguage: string
      abhaLinked: boolean
      relationshipToAccount: $Enums.RelationshipRole
      allergies: string[]
      conditions: string[]
      currentMedications: string[]
      avatarTone: string | null
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients and returns the data updated in the database.
     * @param {PatientUpdateManyAndReturnArgs} args - Arguments to update many Patients.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    account<T extends AccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AccountDefaultArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    handovers<T extends Patient$handoversArgs<ExtArgs> = {}>(args?: Subset<T, Patient$handoversArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    queueEntries<T extends Patient$queueEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Patient$queueEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    encounters<T extends Patient$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Patient$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    consents<T extends Patient$consentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$consentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Patient model
   */
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly accountId: FieldRef<"Patient", 'String'>
    readonly fullName: FieldRef<"Patient", 'String'>
    readonly sex: FieldRef<"Patient", 'Sex'>
    readonly dateOfBirth: FieldRef<"Patient", 'DateTime'>
    readonly phoneMasked: FieldRef<"Patient", 'String'>
    readonly village: FieldRef<"Patient", 'String'>
    readonly district: FieldRef<"Patient", 'String'>
    readonly preferredLanguage: FieldRef<"Patient", 'String'>
    readonly abhaLinked: FieldRef<"Patient", 'Boolean'>
    readonly relationshipToAccount: FieldRef<"Patient", 'RelationshipRole'>
    readonly allergies: FieldRef<"Patient", 'String[]'>
    readonly conditions: FieldRef<"Patient", 'String[]'>
    readonly currentMedications: FieldRef<"Patient", 'String[]'>
    readonly avatarTone: FieldRef<"Patient", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient updateManyAndReturn
   */
  export type PatientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to delete.
     */
    limit?: number
  }

  /**
   * Patient.handovers
   */
  export type Patient$handoversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    where?: AriaHandoverWhereInput
    orderBy?: AriaHandoverOrderByWithRelationInput | AriaHandoverOrderByWithRelationInput[]
    cursor?: AriaHandoverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AriaHandoverScalarFieldEnum | AriaHandoverScalarFieldEnum[]
  }

  /**
   * Patient.queueEntries
   */
  export type Patient$queueEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    where?: QueueEntryWhereInput
    orderBy?: QueueEntryOrderByWithRelationInput | QueueEntryOrderByWithRelationInput[]
    cursor?: QueueEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QueueEntryScalarFieldEnum | QueueEntryScalarFieldEnum[]
  }

  /**
   * Patient.encounters
   */
  export type Patient$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Patient.consents
   */
  export type Patient$consentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    where?: ConsentGrantWhereInput
    orderBy?: ConsentGrantOrderByWithRelationInput | ConsentGrantOrderByWithRelationInput[]
    cursor?: ConsentGrantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConsentGrantScalarFieldEnum | ConsentGrantScalarFieldEnum[]
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
  }


  /**
   * Model AriaHandover
   */

  export type AggregateAriaHandover = {
    _count: AriaHandoverCountAggregateOutputType | null
    _avg: AriaHandoverAvgAggregateOutputType | null
    _sum: AriaHandoverSumAggregateOutputType | null
    _min: AriaHandoverMinAggregateOutputType | null
    _max: AriaHandoverMaxAggregateOutputType | null
  }

  export type AriaHandoverAvgAggregateOutputType = {
    aiConfidence: number | null
  }

  export type AriaHandoverSumAggregateOutputType = {
    aiConfidence: number | null
  }

  export type AriaHandoverMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    createdAt: Date | null
    chiefComplaint: string | null
    narrative: string | null
    durationText: string | null
    aiConfidence: number | null
    suggestedTriage: $Enums.TriageLevel | null
    language: string | null
    verifiedByDoctor: boolean | null
  }

  export type AriaHandoverMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    createdAt: Date | null
    chiefComplaint: string | null
    narrative: string | null
    durationText: string | null
    aiConfidence: number | null
    suggestedTriage: $Enums.TriageLevel | null
    language: string | null
    verifiedByDoctor: boolean | null
  }

  export type AriaHandoverCountAggregateOutputType = {
    id: number
    patientId: number
    createdAt: number
    chiefComplaint: number
    narrative: number
    durationText: number
    symptoms: number
    redFlags: number
    vitals: number
    aiConfidence: number
    suggestedTriage: number
    language: number
    verifiedByDoctor: number
    _all: number
  }


  export type AriaHandoverAvgAggregateInputType = {
    aiConfidence?: true
  }

  export type AriaHandoverSumAggregateInputType = {
    aiConfidence?: true
  }

  export type AriaHandoverMinAggregateInputType = {
    id?: true
    patientId?: true
    createdAt?: true
    chiefComplaint?: true
    narrative?: true
    durationText?: true
    aiConfidence?: true
    suggestedTriage?: true
    language?: true
    verifiedByDoctor?: true
  }

  export type AriaHandoverMaxAggregateInputType = {
    id?: true
    patientId?: true
    createdAt?: true
    chiefComplaint?: true
    narrative?: true
    durationText?: true
    aiConfidence?: true
    suggestedTriage?: true
    language?: true
    verifiedByDoctor?: true
  }

  export type AriaHandoverCountAggregateInputType = {
    id?: true
    patientId?: true
    createdAt?: true
    chiefComplaint?: true
    narrative?: true
    durationText?: true
    symptoms?: true
    redFlags?: true
    vitals?: true
    aiConfidence?: true
    suggestedTriage?: true
    language?: true
    verifiedByDoctor?: true
    _all?: true
  }

  export type AriaHandoverAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AriaHandover to aggregate.
     */
    where?: AriaHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AriaHandovers to fetch.
     */
    orderBy?: AriaHandoverOrderByWithRelationInput | AriaHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AriaHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AriaHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AriaHandovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AriaHandovers
    **/
    _count?: true | AriaHandoverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AriaHandoverAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AriaHandoverSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AriaHandoverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AriaHandoverMaxAggregateInputType
  }

  export type GetAriaHandoverAggregateType<T extends AriaHandoverAggregateArgs> = {
        [P in keyof T & keyof AggregateAriaHandover]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAriaHandover[P]>
      : GetScalarType<T[P], AggregateAriaHandover[P]>
  }




  export type AriaHandoverGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AriaHandoverWhereInput
    orderBy?: AriaHandoverOrderByWithAggregationInput | AriaHandoverOrderByWithAggregationInput[]
    by: AriaHandoverScalarFieldEnum[] | AriaHandoverScalarFieldEnum
    having?: AriaHandoverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AriaHandoverCountAggregateInputType | true
    _avg?: AriaHandoverAvgAggregateInputType
    _sum?: AriaHandoverSumAggregateInputType
    _min?: AriaHandoverMinAggregateInputType
    _max?: AriaHandoverMaxAggregateInputType
  }

  export type AriaHandoverGroupByOutputType = {
    id: string
    patientId: string
    createdAt: Date
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms: string[]
    redFlags: string[]
    vitals: JsonValue | null
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor: boolean
    _count: AriaHandoverCountAggregateOutputType | null
    _avg: AriaHandoverAvgAggregateOutputType | null
    _sum: AriaHandoverSumAggregateOutputType | null
    _min: AriaHandoverMinAggregateOutputType | null
    _max: AriaHandoverMaxAggregateOutputType | null
  }

  type GetAriaHandoverGroupByPayload<T extends AriaHandoverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AriaHandoverGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AriaHandoverGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AriaHandoverGroupByOutputType[P]>
            : GetScalarType<T[P], AriaHandoverGroupByOutputType[P]>
        }
      >
    >


  export type AriaHandoverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    createdAt?: boolean
    chiefComplaint?: boolean
    narrative?: boolean
    durationText?: boolean
    symptoms?: boolean
    redFlags?: boolean
    vitals?: boolean
    aiConfidence?: boolean
    suggestedTriage?: boolean
    language?: boolean
    verifiedByDoctor?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    queueEntry?: boolean | AriaHandover$queueEntryArgs<ExtArgs>
  }, ExtArgs["result"]["ariaHandover"]>

  export type AriaHandoverSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    createdAt?: boolean
    chiefComplaint?: boolean
    narrative?: boolean
    durationText?: boolean
    symptoms?: boolean
    redFlags?: boolean
    vitals?: boolean
    aiConfidence?: boolean
    suggestedTriage?: boolean
    language?: boolean
    verifiedByDoctor?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ariaHandover"]>

  export type AriaHandoverSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    createdAt?: boolean
    chiefComplaint?: boolean
    narrative?: boolean
    durationText?: boolean
    symptoms?: boolean
    redFlags?: boolean
    vitals?: boolean
    aiConfidence?: boolean
    suggestedTriage?: boolean
    language?: boolean
    verifiedByDoctor?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ariaHandover"]>

  export type AriaHandoverSelectScalar = {
    id?: boolean
    patientId?: boolean
    createdAt?: boolean
    chiefComplaint?: boolean
    narrative?: boolean
    durationText?: boolean
    symptoms?: boolean
    redFlags?: boolean
    vitals?: boolean
    aiConfidence?: boolean
    suggestedTriage?: boolean
    language?: boolean
    verifiedByDoctor?: boolean
  }

  export type AriaHandoverOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "createdAt" | "chiefComplaint" | "narrative" | "durationText" | "symptoms" | "redFlags" | "vitals" | "aiConfidence" | "suggestedTriage" | "language" | "verifiedByDoctor", ExtArgs["result"]["ariaHandover"]>
  export type AriaHandoverInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    queueEntry?: boolean | AriaHandover$queueEntryArgs<ExtArgs>
  }
  export type AriaHandoverIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type AriaHandoverIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $AriaHandoverPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AriaHandover"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      queueEntry: Prisma.$QueueEntryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      createdAt: Date
      chiefComplaint: string
      narrative: string
      durationText: string
      symptoms: string[]
      redFlags: string[]
      vitals: Prisma.JsonValue | null
      aiConfidence: number
      suggestedTriage: $Enums.TriageLevel
      language: string
      verifiedByDoctor: boolean
    }, ExtArgs["result"]["ariaHandover"]>
    composites: {}
  }

  type AriaHandoverGetPayload<S extends boolean | null | undefined | AriaHandoverDefaultArgs> = $Result.GetResult<Prisma.$AriaHandoverPayload, S>

  type AriaHandoverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AriaHandoverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AriaHandoverCountAggregateInputType | true
    }

  export interface AriaHandoverDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AriaHandover'], meta: { name: 'AriaHandover' } }
    /**
     * Find zero or one AriaHandover that matches the filter.
     * @param {AriaHandoverFindUniqueArgs} args - Arguments to find a AriaHandover
     * @example
     * // Get one AriaHandover
     * const ariaHandover = await prisma.ariaHandover.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AriaHandoverFindUniqueArgs>(args: SelectSubset<T, AriaHandoverFindUniqueArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AriaHandover that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AriaHandoverFindUniqueOrThrowArgs} args - Arguments to find a AriaHandover
     * @example
     * // Get one AriaHandover
     * const ariaHandover = await prisma.ariaHandover.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AriaHandoverFindUniqueOrThrowArgs>(args: SelectSubset<T, AriaHandoverFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AriaHandover that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AriaHandoverFindFirstArgs} args - Arguments to find a AriaHandover
     * @example
     * // Get one AriaHandover
     * const ariaHandover = await prisma.ariaHandover.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AriaHandoverFindFirstArgs>(args?: SelectSubset<T, AriaHandoverFindFirstArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AriaHandover that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AriaHandoverFindFirstOrThrowArgs} args - Arguments to find a AriaHandover
     * @example
     * // Get one AriaHandover
     * const ariaHandover = await prisma.ariaHandover.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AriaHandoverFindFirstOrThrowArgs>(args?: SelectSubset<T, AriaHandoverFindFirstOrThrowArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AriaHandovers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AriaHandoverFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AriaHandovers
     * const ariaHandovers = await prisma.ariaHandover.findMany()
     * 
     * // Get first 10 AriaHandovers
     * const ariaHandovers = await prisma.ariaHandover.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ariaHandoverWithIdOnly = await prisma.ariaHandover.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AriaHandoverFindManyArgs>(args?: SelectSubset<T, AriaHandoverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AriaHandover.
     * @param {AriaHandoverCreateArgs} args - Arguments to create a AriaHandover.
     * @example
     * // Create one AriaHandover
     * const AriaHandover = await prisma.ariaHandover.create({
     *   data: {
     *     // ... data to create a AriaHandover
     *   }
     * })
     * 
     */
    create<T extends AriaHandoverCreateArgs>(args: SelectSubset<T, AriaHandoverCreateArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AriaHandovers.
     * @param {AriaHandoverCreateManyArgs} args - Arguments to create many AriaHandovers.
     * @example
     * // Create many AriaHandovers
     * const ariaHandover = await prisma.ariaHandover.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AriaHandoverCreateManyArgs>(args?: SelectSubset<T, AriaHandoverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AriaHandovers and returns the data saved in the database.
     * @param {AriaHandoverCreateManyAndReturnArgs} args - Arguments to create many AriaHandovers.
     * @example
     * // Create many AriaHandovers
     * const ariaHandover = await prisma.ariaHandover.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AriaHandovers and only return the `id`
     * const ariaHandoverWithIdOnly = await prisma.ariaHandover.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AriaHandoverCreateManyAndReturnArgs>(args?: SelectSubset<T, AriaHandoverCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AriaHandover.
     * @param {AriaHandoverDeleteArgs} args - Arguments to delete one AriaHandover.
     * @example
     * // Delete one AriaHandover
     * const AriaHandover = await prisma.ariaHandover.delete({
     *   where: {
     *     // ... filter to delete one AriaHandover
     *   }
     * })
     * 
     */
    delete<T extends AriaHandoverDeleteArgs>(args: SelectSubset<T, AriaHandoverDeleteArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AriaHandover.
     * @param {AriaHandoverUpdateArgs} args - Arguments to update one AriaHandover.
     * @example
     * // Update one AriaHandover
     * const ariaHandover = await prisma.ariaHandover.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AriaHandoverUpdateArgs>(args: SelectSubset<T, AriaHandoverUpdateArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AriaHandovers.
     * @param {AriaHandoverDeleteManyArgs} args - Arguments to filter AriaHandovers to delete.
     * @example
     * // Delete a few AriaHandovers
     * const { count } = await prisma.ariaHandover.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AriaHandoverDeleteManyArgs>(args?: SelectSubset<T, AriaHandoverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AriaHandovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AriaHandoverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AriaHandovers
     * const ariaHandover = await prisma.ariaHandover.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AriaHandoverUpdateManyArgs>(args: SelectSubset<T, AriaHandoverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AriaHandovers and returns the data updated in the database.
     * @param {AriaHandoverUpdateManyAndReturnArgs} args - Arguments to update many AriaHandovers.
     * @example
     * // Update many AriaHandovers
     * const ariaHandover = await prisma.ariaHandover.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AriaHandovers and only return the `id`
     * const ariaHandoverWithIdOnly = await prisma.ariaHandover.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AriaHandoverUpdateManyAndReturnArgs>(args: SelectSubset<T, AriaHandoverUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AriaHandover.
     * @param {AriaHandoverUpsertArgs} args - Arguments to update or create a AriaHandover.
     * @example
     * // Update or create a AriaHandover
     * const ariaHandover = await prisma.ariaHandover.upsert({
     *   create: {
     *     // ... data to create a AriaHandover
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AriaHandover we want to update
     *   }
     * })
     */
    upsert<T extends AriaHandoverUpsertArgs>(args: SelectSubset<T, AriaHandoverUpsertArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AriaHandovers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AriaHandoverCountArgs} args - Arguments to filter AriaHandovers to count.
     * @example
     * // Count the number of AriaHandovers
     * const count = await prisma.ariaHandover.count({
     *   where: {
     *     // ... the filter for the AriaHandovers we want to count
     *   }
     * })
    **/
    count<T extends AriaHandoverCountArgs>(
      args?: Subset<T, AriaHandoverCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AriaHandoverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AriaHandover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AriaHandoverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AriaHandoverAggregateArgs>(args: Subset<T, AriaHandoverAggregateArgs>): Prisma.PrismaPromise<GetAriaHandoverAggregateType<T>>

    /**
     * Group by AriaHandover.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AriaHandoverGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AriaHandoverGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AriaHandoverGroupByArgs['orderBy'] }
        : { orderBy?: AriaHandoverGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AriaHandoverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAriaHandoverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AriaHandover model
   */
  readonly fields: AriaHandoverFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AriaHandover.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AriaHandoverClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    queueEntry<T extends AriaHandover$queueEntryArgs<ExtArgs> = {}>(args?: Subset<T, AriaHandover$queueEntryArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AriaHandover model
   */
  interface AriaHandoverFieldRefs {
    readonly id: FieldRef<"AriaHandover", 'String'>
    readonly patientId: FieldRef<"AriaHandover", 'String'>
    readonly createdAt: FieldRef<"AriaHandover", 'DateTime'>
    readonly chiefComplaint: FieldRef<"AriaHandover", 'String'>
    readonly narrative: FieldRef<"AriaHandover", 'String'>
    readonly durationText: FieldRef<"AriaHandover", 'String'>
    readonly symptoms: FieldRef<"AriaHandover", 'String[]'>
    readonly redFlags: FieldRef<"AriaHandover", 'String[]'>
    readonly vitals: FieldRef<"AriaHandover", 'Json'>
    readonly aiConfidence: FieldRef<"AriaHandover", 'Float'>
    readonly suggestedTriage: FieldRef<"AriaHandover", 'TriageLevel'>
    readonly language: FieldRef<"AriaHandover", 'String'>
    readonly verifiedByDoctor: FieldRef<"AriaHandover", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * AriaHandover findUnique
   */
  export type AriaHandoverFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * Filter, which AriaHandover to fetch.
     */
    where: AriaHandoverWhereUniqueInput
  }

  /**
   * AriaHandover findUniqueOrThrow
   */
  export type AriaHandoverFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * Filter, which AriaHandover to fetch.
     */
    where: AriaHandoverWhereUniqueInput
  }

  /**
   * AriaHandover findFirst
   */
  export type AriaHandoverFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * Filter, which AriaHandover to fetch.
     */
    where?: AriaHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AriaHandovers to fetch.
     */
    orderBy?: AriaHandoverOrderByWithRelationInput | AriaHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AriaHandovers.
     */
    cursor?: AriaHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AriaHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AriaHandovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AriaHandovers.
     */
    distinct?: AriaHandoverScalarFieldEnum | AriaHandoverScalarFieldEnum[]
  }

  /**
   * AriaHandover findFirstOrThrow
   */
  export type AriaHandoverFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * Filter, which AriaHandover to fetch.
     */
    where?: AriaHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AriaHandovers to fetch.
     */
    orderBy?: AriaHandoverOrderByWithRelationInput | AriaHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AriaHandovers.
     */
    cursor?: AriaHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AriaHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AriaHandovers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AriaHandovers.
     */
    distinct?: AriaHandoverScalarFieldEnum | AriaHandoverScalarFieldEnum[]
  }

  /**
   * AriaHandover findMany
   */
  export type AriaHandoverFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * Filter, which AriaHandovers to fetch.
     */
    where?: AriaHandoverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AriaHandovers to fetch.
     */
    orderBy?: AriaHandoverOrderByWithRelationInput | AriaHandoverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AriaHandovers.
     */
    cursor?: AriaHandoverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AriaHandovers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AriaHandovers.
     */
    skip?: number
    distinct?: AriaHandoverScalarFieldEnum | AriaHandoverScalarFieldEnum[]
  }

  /**
   * AriaHandover create
   */
  export type AriaHandoverCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * The data needed to create a AriaHandover.
     */
    data: XOR<AriaHandoverCreateInput, AriaHandoverUncheckedCreateInput>
  }

  /**
   * AriaHandover createMany
   */
  export type AriaHandoverCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AriaHandovers.
     */
    data: AriaHandoverCreateManyInput | AriaHandoverCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AriaHandover createManyAndReturn
   */
  export type AriaHandoverCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * The data used to create many AriaHandovers.
     */
    data: AriaHandoverCreateManyInput | AriaHandoverCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AriaHandover update
   */
  export type AriaHandoverUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * The data needed to update a AriaHandover.
     */
    data: XOR<AriaHandoverUpdateInput, AriaHandoverUncheckedUpdateInput>
    /**
     * Choose, which AriaHandover to update.
     */
    where: AriaHandoverWhereUniqueInput
  }

  /**
   * AriaHandover updateMany
   */
  export type AriaHandoverUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AriaHandovers.
     */
    data: XOR<AriaHandoverUpdateManyMutationInput, AriaHandoverUncheckedUpdateManyInput>
    /**
     * Filter which AriaHandovers to update
     */
    where?: AriaHandoverWhereInput
    /**
     * Limit how many AriaHandovers to update.
     */
    limit?: number
  }

  /**
   * AriaHandover updateManyAndReturn
   */
  export type AriaHandoverUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * The data used to update AriaHandovers.
     */
    data: XOR<AriaHandoverUpdateManyMutationInput, AriaHandoverUncheckedUpdateManyInput>
    /**
     * Filter which AriaHandovers to update
     */
    where?: AriaHandoverWhereInput
    /**
     * Limit how many AriaHandovers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AriaHandover upsert
   */
  export type AriaHandoverUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * The filter to search for the AriaHandover to update in case it exists.
     */
    where: AriaHandoverWhereUniqueInput
    /**
     * In case the AriaHandover found by the `where` argument doesn't exist, create a new AriaHandover with this data.
     */
    create: XOR<AriaHandoverCreateInput, AriaHandoverUncheckedCreateInput>
    /**
     * In case the AriaHandover was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AriaHandoverUpdateInput, AriaHandoverUncheckedUpdateInput>
  }

  /**
   * AriaHandover delete
   */
  export type AriaHandoverDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    /**
     * Filter which AriaHandover to delete.
     */
    where: AriaHandoverWhereUniqueInput
  }

  /**
   * AriaHandover deleteMany
   */
  export type AriaHandoverDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AriaHandovers to delete
     */
    where?: AriaHandoverWhereInput
    /**
     * Limit how many AriaHandovers to delete.
     */
    limit?: number
  }

  /**
   * AriaHandover.queueEntry
   */
  export type AriaHandover$queueEntryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    where?: QueueEntryWhereInput
  }

  /**
   * AriaHandover without action
   */
  export type AriaHandoverDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
  }


  /**
   * Model QueueEntry
   */

  export type AggregateQueueEntry = {
    _count: QueueEntryCountAggregateOutputType | null
    _min: QueueEntryMinAggregateOutputType | null
    _max: QueueEntryMaxAggregateOutputType | null
  }

  export type QueueEntryMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    doctorId: string | null
    kind: $Enums.EncounterKind | null
    triage: $Enums.TriageLevel | null
    state: $Enums.QueueState | null
    checkedInAt: Date | null
    scheduledFor: Date | null
    channel: $Enums.ConsultChannel | null
    reason: string | null
    connectionQuality: string | null
    handoverId: string | null
  }

  export type QueueEntryMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    doctorId: string | null
    kind: $Enums.EncounterKind | null
    triage: $Enums.TriageLevel | null
    state: $Enums.QueueState | null
    checkedInAt: Date | null
    scheduledFor: Date | null
    channel: $Enums.ConsultChannel | null
    reason: string | null
    connectionQuality: string | null
    handoverId: string | null
  }

  export type QueueEntryCountAggregateOutputType = {
    id: number
    patientId: number
    doctorId: number
    kind: number
    triage: number
    state: number
    checkedInAt: number
    scheduledFor: number
    channel: number
    reason: number
    connectionQuality: number
    handoverId: number
    _all: number
  }


  export type QueueEntryMinAggregateInputType = {
    id?: true
    patientId?: true
    doctorId?: true
    kind?: true
    triage?: true
    state?: true
    checkedInAt?: true
    scheduledFor?: true
    channel?: true
    reason?: true
    connectionQuality?: true
    handoverId?: true
  }

  export type QueueEntryMaxAggregateInputType = {
    id?: true
    patientId?: true
    doctorId?: true
    kind?: true
    triage?: true
    state?: true
    checkedInAt?: true
    scheduledFor?: true
    channel?: true
    reason?: true
    connectionQuality?: true
    handoverId?: true
  }

  export type QueueEntryCountAggregateInputType = {
    id?: true
    patientId?: true
    doctorId?: true
    kind?: true
    triage?: true
    state?: true
    checkedInAt?: true
    scheduledFor?: true
    channel?: true
    reason?: true
    connectionQuality?: true
    handoverId?: true
    _all?: true
  }

  export type QueueEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QueueEntry to aggregate.
     */
    where?: QueueEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueEntries to fetch.
     */
    orderBy?: QueueEntryOrderByWithRelationInput | QueueEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QueueEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QueueEntries
    **/
    _count?: true | QueueEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QueueEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QueueEntryMaxAggregateInputType
  }

  export type GetQueueEntryAggregateType<T extends QueueEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateQueueEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQueueEntry[P]>
      : GetScalarType<T[P], AggregateQueueEntry[P]>
  }




  export type QueueEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueueEntryWhereInput
    orderBy?: QueueEntryOrderByWithAggregationInput | QueueEntryOrderByWithAggregationInput[]
    by: QueueEntryScalarFieldEnum[] | QueueEntryScalarFieldEnum
    having?: QueueEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QueueEntryCountAggregateInputType | true
    _min?: QueueEntryMinAggregateInputType
    _max?: QueueEntryMaxAggregateInputType
  }

  export type QueueEntryGroupByOutputType = {
    id: string
    patientId: string
    doctorId: string | null
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state: $Enums.QueueState
    checkedInAt: Date
    scheduledFor: Date
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality: string
    handoverId: string | null
    _count: QueueEntryCountAggregateOutputType | null
    _min: QueueEntryMinAggregateOutputType | null
    _max: QueueEntryMaxAggregateOutputType | null
  }

  type GetQueueEntryGroupByPayload<T extends QueueEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QueueEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QueueEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QueueEntryGroupByOutputType[P]>
            : GetScalarType<T[P], QueueEntryGroupByOutputType[P]>
        }
      >
    >


  export type QueueEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    kind?: boolean
    triage?: boolean
    state?: boolean
    checkedInAt?: boolean
    scheduledFor?: boolean
    channel?: boolean
    reason?: boolean
    connectionQuality?: boolean
    handoverId?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | QueueEntry$doctorArgs<ExtArgs>
    handover?: boolean | QueueEntry$handoverArgs<ExtArgs>
  }, ExtArgs["result"]["queueEntry"]>

  export type QueueEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    kind?: boolean
    triage?: boolean
    state?: boolean
    checkedInAt?: boolean
    scheduledFor?: boolean
    channel?: boolean
    reason?: boolean
    connectionQuality?: boolean
    handoverId?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | QueueEntry$doctorArgs<ExtArgs>
    handover?: boolean | QueueEntry$handoverArgs<ExtArgs>
  }, ExtArgs["result"]["queueEntry"]>

  export type QueueEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    kind?: boolean
    triage?: boolean
    state?: boolean
    checkedInAt?: boolean
    scheduledFor?: boolean
    channel?: boolean
    reason?: boolean
    connectionQuality?: boolean
    handoverId?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | QueueEntry$doctorArgs<ExtArgs>
    handover?: boolean | QueueEntry$handoverArgs<ExtArgs>
  }, ExtArgs["result"]["queueEntry"]>

  export type QueueEntrySelectScalar = {
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    kind?: boolean
    triage?: boolean
    state?: boolean
    checkedInAt?: boolean
    scheduledFor?: boolean
    channel?: boolean
    reason?: boolean
    connectionQuality?: boolean
    handoverId?: boolean
  }

  export type QueueEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "doctorId" | "kind" | "triage" | "state" | "checkedInAt" | "scheduledFor" | "channel" | "reason" | "connectionQuality" | "handoverId", ExtArgs["result"]["queueEntry"]>
  export type QueueEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | QueueEntry$doctorArgs<ExtArgs>
    handover?: boolean | QueueEntry$handoverArgs<ExtArgs>
  }
  export type QueueEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | QueueEntry$doctorArgs<ExtArgs>
    handover?: boolean | QueueEntry$handoverArgs<ExtArgs>
  }
  export type QueueEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | QueueEntry$doctorArgs<ExtArgs>
    handover?: boolean | QueueEntry$handoverArgs<ExtArgs>
  }

  export type $QueueEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QueueEntry"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      doctor: Prisma.$DoctorPayload<ExtArgs> | null
      handover: Prisma.$AriaHandoverPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      doctorId: string | null
      kind: $Enums.EncounterKind
      triage: $Enums.TriageLevel
      state: $Enums.QueueState
      checkedInAt: Date
      scheduledFor: Date
      channel: $Enums.ConsultChannel
      reason: string
      connectionQuality: string
      handoverId: string | null
    }, ExtArgs["result"]["queueEntry"]>
    composites: {}
  }

  type QueueEntryGetPayload<S extends boolean | null | undefined | QueueEntryDefaultArgs> = $Result.GetResult<Prisma.$QueueEntryPayload, S>

  type QueueEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QueueEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QueueEntryCountAggregateInputType | true
    }

  export interface QueueEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QueueEntry'], meta: { name: 'QueueEntry' } }
    /**
     * Find zero or one QueueEntry that matches the filter.
     * @param {QueueEntryFindUniqueArgs} args - Arguments to find a QueueEntry
     * @example
     * // Get one QueueEntry
     * const queueEntry = await prisma.queueEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QueueEntryFindUniqueArgs>(args: SelectSubset<T, QueueEntryFindUniqueArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QueueEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QueueEntryFindUniqueOrThrowArgs} args - Arguments to find a QueueEntry
     * @example
     * // Get one QueueEntry
     * const queueEntry = await prisma.queueEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QueueEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, QueueEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QueueEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueEntryFindFirstArgs} args - Arguments to find a QueueEntry
     * @example
     * // Get one QueueEntry
     * const queueEntry = await prisma.queueEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QueueEntryFindFirstArgs>(args?: SelectSubset<T, QueueEntryFindFirstArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QueueEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueEntryFindFirstOrThrowArgs} args - Arguments to find a QueueEntry
     * @example
     * // Get one QueueEntry
     * const queueEntry = await prisma.queueEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QueueEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, QueueEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QueueEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QueueEntries
     * const queueEntries = await prisma.queueEntry.findMany()
     * 
     * // Get first 10 QueueEntries
     * const queueEntries = await prisma.queueEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const queueEntryWithIdOnly = await prisma.queueEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QueueEntryFindManyArgs>(args?: SelectSubset<T, QueueEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QueueEntry.
     * @param {QueueEntryCreateArgs} args - Arguments to create a QueueEntry.
     * @example
     * // Create one QueueEntry
     * const QueueEntry = await prisma.queueEntry.create({
     *   data: {
     *     // ... data to create a QueueEntry
     *   }
     * })
     * 
     */
    create<T extends QueueEntryCreateArgs>(args: SelectSubset<T, QueueEntryCreateArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QueueEntries.
     * @param {QueueEntryCreateManyArgs} args - Arguments to create many QueueEntries.
     * @example
     * // Create many QueueEntries
     * const queueEntry = await prisma.queueEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QueueEntryCreateManyArgs>(args?: SelectSubset<T, QueueEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QueueEntries and returns the data saved in the database.
     * @param {QueueEntryCreateManyAndReturnArgs} args - Arguments to create many QueueEntries.
     * @example
     * // Create many QueueEntries
     * const queueEntry = await prisma.queueEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QueueEntries and only return the `id`
     * const queueEntryWithIdOnly = await prisma.queueEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QueueEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, QueueEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QueueEntry.
     * @param {QueueEntryDeleteArgs} args - Arguments to delete one QueueEntry.
     * @example
     * // Delete one QueueEntry
     * const QueueEntry = await prisma.queueEntry.delete({
     *   where: {
     *     // ... filter to delete one QueueEntry
     *   }
     * })
     * 
     */
    delete<T extends QueueEntryDeleteArgs>(args: SelectSubset<T, QueueEntryDeleteArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QueueEntry.
     * @param {QueueEntryUpdateArgs} args - Arguments to update one QueueEntry.
     * @example
     * // Update one QueueEntry
     * const queueEntry = await prisma.queueEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QueueEntryUpdateArgs>(args: SelectSubset<T, QueueEntryUpdateArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QueueEntries.
     * @param {QueueEntryDeleteManyArgs} args - Arguments to filter QueueEntries to delete.
     * @example
     * // Delete a few QueueEntries
     * const { count } = await prisma.queueEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QueueEntryDeleteManyArgs>(args?: SelectSubset<T, QueueEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QueueEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QueueEntries
     * const queueEntry = await prisma.queueEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QueueEntryUpdateManyArgs>(args: SelectSubset<T, QueueEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QueueEntries and returns the data updated in the database.
     * @param {QueueEntryUpdateManyAndReturnArgs} args - Arguments to update many QueueEntries.
     * @example
     * // Update many QueueEntries
     * const queueEntry = await prisma.queueEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QueueEntries and only return the `id`
     * const queueEntryWithIdOnly = await prisma.queueEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QueueEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, QueueEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QueueEntry.
     * @param {QueueEntryUpsertArgs} args - Arguments to update or create a QueueEntry.
     * @example
     * // Update or create a QueueEntry
     * const queueEntry = await prisma.queueEntry.upsert({
     *   create: {
     *     // ... data to create a QueueEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QueueEntry we want to update
     *   }
     * })
     */
    upsert<T extends QueueEntryUpsertArgs>(args: SelectSubset<T, QueueEntryUpsertArgs<ExtArgs>>): Prisma__QueueEntryClient<$Result.GetResult<Prisma.$QueueEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QueueEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueEntryCountArgs} args - Arguments to filter QueueEntries to count.
     * @example
     * // Count the number of QueueEntries
     * const count = await prisma.queueEntry.count({
     *   where: {
     *     // ... the filter for the QueueEntries we want to count
     *   }
     * })
    **/
    count<T extends QueueEntryCountArgs>(
      args?: Subset<T, QueueEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QueueEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QueueEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QueueEntryAggregateArgs>(args: Subset<T, QueueEntryAggregateArgs>): Prisma.PrismaPromise<GetQueueEntryAggregateType<T>>

    /**
     * Group by QueueEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QueueEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QueueEntryGroupByArgs['orderBy'] }
        : { orderBy?: QueueEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QueueEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQueueEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QueueEntry model
   */
  readonly fields: QueueEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QueueEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QueueEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    doctor<T extends QueueEntry$doctorArgs<ExtArgs> = {}>(args?: Subset<T, QueueEntry$doctorArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    handover<T extends QueueEntry$handoverArgs<ExtArgs> = {}>(args?: Subset<T, QueueEntry$handoverArgs<ExtArgs>>): Prisma__AriaHandoverClient<$Result.GetResult<Prisma.$AriaHandoverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QueueEntry model
   */
  interface QueueEntryFieldRefs {
    readonly id: FieldRef<"QueueEntry", 'String'>
    readonly patientId: FieldRef<"QueueEntry", 'String'>
    readonly doctorId: FieldRef<"QueueEntry", 'String'>
    readonly kind: FieldRef<"QueueEntry", 'EncounterKind'>
    readonly triage: FieldRef<"QueueEntry", 'TriageLevel'>
    readonly state: FieldRef<"QueueEntry", 'QueueState'>
    readonly checkedInAt: FieldRef<"QueueEntry", 'DateTime'>
    readonly scheduledFor: FieldRef<"QueueEntry", 'DateTime'>
    readonly channel: FieldRef<"QueueEntry", 'ConsultChannel'>
    readonly reason: FieldRef<"QueueEntry", 'String'>
    readonly connectionQuality: FieldRef<"QueueEntry", 'String'>
    readonly handoverId: FieldRef<"QueueEntry", 'String'>
  }
    

  // Custom InputTypes
  /**
   * QueueEntry findUnique
   */
  export type QueueEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * Filter, which QueueEntry to fetch.
     */
    where: QueueEntryWhereUniqueInput
  }

  /**
   * QueueEntry findUniqueOrThrow
   */
  export type QueueEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * Filter, which QueueEntry to fetch.
     */
    where: QueueEntryWhereUniqueInput
  }

  /**
   * QueueEntry findFirst
   */
  export type QueueEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * Filter, which QueueEntry to fetch.
     */
    where?: QueueEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueEntries to fetch.
     */
    orderBy?: QueueEntryOrderByWithRelationInput | QueueEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QueueEntries.
     */
    cursor?: QueueEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QueueEntries.
     */
    distinct?: QueueEntryScalarFieldEnum | QueueEntryScalarFieldEnum[]
  }

  /**
   * QueueEntry findFirstOrThrow
   */
  export type QueueEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * Filter, which QueueEntry to fetch.
     */
    where?: QueueEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueEntries to fetch.
     */
    orderBy?: QueueEntryOrderByWithRelationInput | QueueEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QueueEntries.
     */
    cursor?: QueueEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QueueEntries.
     */
    distinct?: QueueEntryScalarFieldEnum | QueueEntryScalarFieldEnum[]
  }

  /**
   * QueueEntry findMany
   */
  export type QueueEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * Filter, which QueueEntries to fetch.
     */
    where?: QueueEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QueueEntries to fetch.
     */
    orderBy?: QueueEntryOrderByWithRelationInput | QueueEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QueueEntries.
     */
    cursor?: QueueEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QueueEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QueueEntries.
     */
    skip?: number
    distinct?: QueueEntryScalarFieldEnum | QueueEntryScalarFieldEnum[]
  }

  /**
   * QueueEntry create
   */
  export type QueueEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a QueueEntry.
     */
    data: XOR<QueueEntryCreateInput, QueueEntryUncheckedCreateInput>
  }

  /**
   * QueueEntry createMany
   */
  export type QueueEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QueueEntries.
     */
    data: QueueEntryCreateManyInput | QueueEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QueueEntry createManyAndReturn
   */
  export type QueueEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * The data used to create many QueueEntries.
     */
    data: QueueEntryCreateManyInput | QueueEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QueueEntry update
   */
  export type QueueEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a QueueEntry.
     */
    data: XOR<QueueEntryUpdateInput, QueueEntryUncheckedUpdateInput>
    /**
     * Choose, which QueueEntry to update.
     */
    where: QueueEntryWhereUniqueInput
  }

  /**
   * QueueEntry updateMany
   */
  export type QueueEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QueueEntries.
     */
    data: XOR<QueueEntryUpdateManyMutationInput, QueueEntryUncheckedUpdateManyInput>
    /**
     * Filter which QueueEntries to update
     */
    where?: QueueEntryWhereInput
    /**
     * Limit how many QueueEntries to update.
     */
    limit?: number
  }

  /**
   * QueueEntry updateManyAndReturn
   */
  export type QueueEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * The data used to update QueueEntries.
     */
    data: XOR<QueueEntryUpdateManyMutationInput, QueueEntryUncheckedUpdateManyInput>
    /**
     * Filter which QueueEntries to update
     */
    where?: QueueEntryWhereInput
    /**
     * Limit how many QueueEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QueueEntry upsert
   */
  export type QueueEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the QueueEntry to update in case it exists.
     */
    where: QueueEntryWhereUniqueInput
    /**
     * In case the QueueEntry found by the `where` argument doesn't exist, create a new QueueEntry with this data.
     */
    create: XOR<QueueEntryCreateInput, QueueEntryUncheckedCreateInput>
    /**
     * In case the QueueEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QueueEntryUpdateInput, QueueEntryUncheckedUpdateInput>
  }

  /**
   * QueueEntry delete
   */
  export type QueueEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
    /**
     * Filter which QueueEntry to delete.
     */
    where: QueueEntryWhereUniqueInput
  }

  /**
   * QueueEntry deleteMany
   */
  export type QueueEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QueueEntries to delete
     */
    where?: QueueEntryWhereInput
    /**
     * Limit how many QueueEntries to delete.
     */
    limit?: number
  }

  /**
   * QueueEntry.doctor
   */
  export type QueueEntry$doctorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    where?: DoctorWhereInput
  }

  /**
   * QueueEntry.handover
   */
  export type QueueEntry$handoverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AriaHandover
     */
    select?: AriaHandoverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AriaHandover
     */
    omit?: AriaHandoverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AriaHandoverInclude<ExtArgs> | null
    where?: AriaHandoverWhereInput
  }

  /**
   * QueueEntry without action
   */
  export type QueueEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueEntry
     */
    select?: QueueEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the QueueEntry
     */
    omit?: QueueEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueEntryInclude<ExtArgs> | null
  }


  /**
   * Model Encounter
   */

  export type AggregateEncounter = {
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  export type EncounterMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    doctorId: string | null
    startedAt: Date | null
    endedAt: Date | null
    channel: $Enums.ConsultChannel | null
    chiefComplaint: string | null
    assessment: string | null
    clinicalNotes: string | null
    ariaAccepted: boolean | null
  }

  export type EncounterMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    doctorId: string | null
    startedAt: Date | null
    endedAt: Date | null
    channel: $Enums.ConsultChannel | null
    chiefComplaint: string | null
    assessment: string | null
    clinicalNotes: string | null
    ariaAccepted: boolean | null
  }

  export type EncounterCountAggregateOutputType = {
    id: number
    patientId: number
    doctorId: number
    startedAt: number
    endedAt: number
    channel: number
    chiefComplaint: number
    assessment: number
    clinicalNotes: number
    prescriptions: number
    labRequests: number
    followUp: number
    ariaAccepted: number
    _all: number
  }


  export type EncounterMinAggregateInputType = {
    id?: true
    patientId?: true
    doctorId?: true
    startedAt?: true
    endedAt?: true
    channel?: true
    chiefComplaint?: true
    assessment?: true
    clinicalNotes?: true
    ariaAccepted?: true
  }

  export type EncounterMaxAggregateInputType = {
    id?: true
    patientId?: true
    doctorId?: true
    startedAt?: true
    endedAt?: true
    channel?: true
    chiefComplaint?: true
    assessment?: true
    clinicalNotes?: true
    ariaAccepted?: true
  }

  export type EncounterCountAggregateInputType = {
    id?: true
    patientId?: true
    doctorId?: true
    startedAt?: true
    endedAt?: true
    channel?: true
    chiefComplaint?: true
    assessment?: true
    clinicalNotes?: true
    prescriptions?: true
    labRequests?: true
    followUp?: true
    ariaAccepted?: true
    _all?: true
  }

  export type EncounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounter to aggregate.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Encounters
    **/
    _count?: true | EncounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EncounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EncounterMaxAggregateInputType
  }

  export type GetEncounterAggregateType<T extends EncounterAggregateArgs> = {
        [P in keyof T & keyof AggregateEncounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEncounter[P]>
      : GetScalarType<T[P], AggregateEncounter[P]>
  }




  export type EncounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithAggregationInput | EncounterOrderByWithAggregationInput[]
    by: EncounterScalarFieldEnum[] | EncounterScalarFieldEnum
    having?: EncounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EncounterCountAggregateInputType | true
    _min?: EncounterMinAggregateInputType
    _max?: EncounterMaxAggregateInputType
  }

  export type EncounterGroupByOutputType = {
    id: string
    patientId: string
    doctorId: string
    startedAt: Date
    endedAt: Date | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions: JsonValue
    labRequests: JsonValue
    followUp: JsonValue | null
    ariaAccepted: boolean
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  type GetEncounterGroupByPayload<T extends EncounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EncounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EncounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EncounterGroupByOutputType[P]>
            : GetScalarType<T[P], EncounterGroupByOutputType[P]>
        }
      >
    >


  export type EncounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    channel?: boolean
    chiefComplaint?: boolean
    assessment?: boolean
    clinicalNotes?: boolean
    prescriptions?: boolean
    labRequests?: boolean
    followUp?: boolean
    ariaAccepted?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    channel?: boolean
    chiefComplaint?: boolean
    assessment?: boolean
    clinicalNotes?: boolean
    prescriptions?: boolean
    labRequests?: boolean
    followUp?: boolean
    ariaAccepted?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    channel?: boolean
    chiefComplaint?: boolean
    assessment?: boolean
    clinicalNotes?: boolean
    prescriptions?: boolean
    labRequests?: boolean
    followUp?: boolean
    ariaAccepted?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectScalar = {
    id?: boolean
    patientId?: boolean
    doctorId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    channel?: boolean
    chiefComplaint?: boolean
    assessment?: boolean
    clinicalNotes?: boolean
    prescriptions?: boolean
    labRequests?: boolean
    followUp?: boolean
    ariaAccepted?: boolean
  }

  export type EncounterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "doctorId" | "startedAt" | "endedAt" | "channel" | "chiefComplaint" | "assessment" | "clinicalNotes" | "prescriptions" | "labRequests" | "followUp" | "ariaAccepted", ExtArgs["result"]["encounter"]>
  export type EncounterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }
  export type EncounterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }
  export type EncounterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }

  export type $EncounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Encounter"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      doctor: Prisma.$DoctorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      doctorId: string
      startedAt: Date
      endedAt: Date | null
      channel: $Enums.ConsultChannel
      chiefComplaint: string
      assessment: string
      clinicalNotes: string
      prescriptions: Prisma.JsonValue
      labRequests: Prisma.JsonValue
      followUp: Prisma.JsonValue | null
      ariaAccepted: boolean
    }, ExtArgs["result"]["encounter"]>
    composites: {}
  }

  type EncounterGetPayload<S extends boolean | null | undefined | EncounterDefaultArgs> = $Result.GetResult<Prisma.$EncounterPayload, S>

  type EncounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EncounterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EncounterCountAggregateInputType | true
    }

  export interface EncounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Encounter'], meta: { name: 'Encounter' } }
    /**
     * Find zero or one Encounter that matches the filter.
     * @param {EncounterFindUniqueArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EncounterFindUniqueArgs>(args: SelectSubset<T, EncounterFindUniqueArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Encounter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EncounterFindUniqueOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EncounterFindUniqueOrThrowArgs>(args: SelectSubset<T, EncounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Encounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EncounterFindFirstArgs>(args?: SelectSubset<T, EncounterFindFirstArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Encounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EncounterFindFirstOrThrowArgs>(args?: SelectSubset<T, EncounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Encounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Encounters
     * const encounters = await prisma.encounter.findMany()
     * 
     * // Get first 10 Encounters
     * const encounters = await prisma.encounter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const encounterWithIdOnly = await prisma.encounter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EncounterFindManyArgs>(args?: SelectSubset<T, EncounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Encounter.
     * @param {EncounterCreateArgs} args - Arguments to create a Encounter.
     * @example
     * // Create one Encounter
     * const Encounter = await prisma.encounter.create({
     *   data: {
     *     // ... data to create a Encounter
     *   }
     * })
     * 
     */
    create<T extends EncounterCreateArgs>(args: SelectSubset<T, EncounterCreateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Encounters.
     * @param {EncounterCreateManyArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EncounterCreateManyArgs>(args?: SelectSubset<T, EncounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Encounters and returns the data saved in the database.
     * @param {EncounterCreateManyAndReturnArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Encounters and only return the `id`
     * const encounterWithIdOnly = await prisma.encounter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EncounterCreateManyAndReturnArgs>(args?: SelectSubset<T, EncounterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Encounter.
     * @param {EncounterDeleteArgs} args - Arguments to delete one Encounter.
     * @example
     * // Delete one Encounter
     * const Encounter = await prisma.encounter.delete({
     *   where: {
     *     // ... filter to delete one Encounter
     *   }
     * })
     * 
     */
    delete<T extends EncounterDeleteArgs>(args: SelectSubset<T, EncounterDeleteArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Encounter.
     * @param {EncounterUpdateArgs} args - Arguments to update one Encounter.
     * @example
     * // Update one Encounter
     * const encounter = await prisma.encounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EncounterUpdateArgs>(args: SelectSubset<T, EncounterUpdateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Encounters.
     * @param {EncounterDeleteManyArgs} args - Arguments to filter Encounters to delete.
     * @example
     * // Delete a few Encounters
     * const { count } = await prisma.encounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EncounterDeleteManyArgs>(args?: SelectSubset<T, EncounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Encounters
     * const encounter = await prisma.encounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EncounterUpdateManyArgs>(args: SelectSubset<T, EncounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Encounters and returns the data updated in the database.
     * @param {EncounterUpdateManyAndReturnArgs} args - Arguments to update many Encounters.
     * @example
     * // Update many Encounters
     * const encounter = await prisma.encounter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Encounters and only return the `id`
     * const encounterWithIdOnly = await prisma.encounter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EncounterUpdateManyAndReturnArgs>(args: SelectSubset<T, EncounterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Encounter.
     * @param {EncounterUpsertArgs} args - Arguments to update or create a Encounter.
     * @example
     * // Update or create a Encounter
     * const encounter = await prisma.encounter.upsert({
     *   create: {
     *     // ... data to create a Encounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Encounter we want to update
     *   }
     * })
     */
    upsert<T extends EncounterUpsertArgs>(args: SelectSubset<T, EncounterUpsertArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCountArgs} args - Arguments to filter Encounters to count.
     * @example
     * // Count the number of Encounters
     * const count = await prisma.encounter.count({
     *   where: {
     *     // ... the filter for the Encounters we want to count
     *   }
     * })
    **/
    count<T extends EncounterCountArgs>(
      args?: Subset<T, EncounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EncounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EncounterAggregateArgs>(args: Subset<T, EncounterAggregateArgs>): Prisma.PrismaPromise<GetEncounterAggregateType<T>>

    /**
     * Group by Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EncounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EncounterGroupByArgs['orderBy'] }
        : { orderBy?: EncounterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EncounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEncounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Encounter model
   */
  readonly fields: EncounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Encounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EncounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    doctor<T extends DoctorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DoctorDefaultArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Encounter model
   */
  interface EncounterFieldRefs {
    readonly id: FieldRef<"Encounter", 'String'>
    readonly patientId: FieldRef<"Encounter", 'String'>
    readonly doctorId: FieldRef<"Encounter", 'String'>
    readonly startedAt: FieldRef<"Encounter", 'DateTime'>
    readonly endedAt: FieldRef<"Encounter", 'DateTime'>
    readonly channel: FieldRef<"Encounter", 'ConsultChannel'>
    readonly chiefComplaint: FieldRef<"Encounter", 'String'>
    readonly assessment: FieldRef<"Encounter", 'String'>
    readonly clinicalNotes: FieldRef<"Encounter", 'String'>
    readonly prescriptions: FieldRef<"Encounter", 'Json'>
    readonly labRequests: FieldRef<"Encounter", 'Json'>
    readonly followUp: FieldRef<"Encounter", 'Json'>
    readonly ariaAccepted: FieldRef<"Encounter", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Encounter findUnique
   */
  export type EncounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findUniqueOrThrow
   */
  export type EncounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findFirst
   */
  export type EncounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findFirstOrThrow
   */
  export type EncounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findMany
   */
  export type EncounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounters to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter create
   */
  export type EncounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to create a Encounter.
     */
    data: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
  }

  /**
   * Encounter createMany
   */
  export type EncounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Encounter createManyAndReturn
   */
  export type EncounterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Encounter update
   */
  export type EncounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to update a Encounter.
     */
    data: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
    /**
     * Choose, which Encounter to update.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter updateMany
   */
  export type EncounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Encounters.
     */
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyInput>
    /**
     * Filter which Encounters to update
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to update.
     */
    limit?: number
  }

  /**
   * Encounter updateManyAndReturn
   */
  export type EncounterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * The data used to update Encounters.
     */
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyInput>
    /**
     * Filter which Encounters to update
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Encounter upsert
   */
  export type EncounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The filter to search for the Encounter to update in case it exists.
     */
    where: EncounterWhereUniqueInput
    /**
     * In case the Encounter found by the `where` argument doesn't exist, create a new Encounter with this data.
     */
    create: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
    /**
     * In case the Encounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
  }

  /**
   * Encounter delete
   */
  export type EncounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter which Encounter to delete.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter deleteMany
   */
  export type EncounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounters to delete
     */
    where?: EncounterWhereInput
    /**
     * Limit how many Encounters to delete.
     */
    limit?: number
  }

  /**
   * Encounter without action
   */
  export type EncounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Encounter
     */
    omit?: EncounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
  }


  /**
   * Model ConsentGrant
   */

  export type AggregateConsentGrant = {
    _count: ConsentGrantCountAggregateOutputType | null
    _min: ConsentGrantMinAggregateOutputType | null
    _max: ConsentGrantMaxAggregateOutputType | null
  }

  export type ConsentGrantMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    grantedTo: string | null
    purpose: string | null
    grantedAt: Date | null
    expiresAt: Date | null
    active: boolean | null
  }

  export type ConsentGrantMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    grantedTo: string | null
    purpose: string | null
    grantedAt: Date | null
    expiresAt: Date | null
    active: boolean | null
  }

  export type ConsentGrantCountAggregateOutputType = {
    id: number
    patientId: number
    grantedTo: number
    purpose: number
    scope: number
    grantedAt: number
    expiresAt: number
    active: number
    _all: number
  }


  export type ConsentGrantMinAggregateInputType = {
    id?: true
    patientId?: true
    grantedTo?: true
    purpose?: true
    grantedAt?: true
    expiresAt?: true
    active?: true
  }

  export type ConsentGrantMaxAggregateInputType = {
    id?: true
    patientId?: true
    grantedTo?: true
    purpose?: true
    grantedAt?: true
    expiresAt?: true
    active?: true
  }

  export type ConsentGrantCountAggregateInputType = {
    id?: true
    patientId?: true
    grantedTo?: true
    purpose?: true
    scope?: true
    grantedAt?: true
    expiresAt?: true
    active?: true
    _all?: true
  }

  export type ConsentGrantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentGrant to aggregate.
     */
    where?: ConsentGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentGrants to fetch.
     */
    orderBy?: ConsentGrantOrderByWithRelationInput | ConsentGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsentGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentGrants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConsentGrants
    **/
    _count?: true | ConsentGrantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsentGrantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsentGrantMaxAggregateInputType
  }

  export type GetConsentGrantAggregateType<T extends ConsentGrantAggregateArgs> = {
        [P in keyof T & keyof AggregateConsentGrant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsentGrant[P]>
      : GetScalarType<T[P], AggregateConsentGrant[P]>
  }




  export type ConsentGrantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentGrantWhereInput
    orderBy?: ConsentGrantOrderByWithAggregationInput | ConsentGrantOrderByWithAggregationInput[]
    by: ConsentGrantScalarFieldEnum[] | ConsentGrantScalarFieldEnum
    having?: ConsentGrantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsentGrantCountAggregateInputType | true
    _min?: ConsentGrantMinAggregateInputType
    _max?: ConsentGrantMaxAggregateInputType
  }

  export type ConsentGrantGroupByOutputType = {
    id: string
    patientId: string
    grantedTo: string
    purpose: string
    scope: string[]
    grantedAt: Date
    expiresAt: Date
    active: boolean
    _count: ConsentGrantCountAggregateOutputType | null
    _min: ConsentGrantMinAggregateOutputType | null
    _max: ConsentGrantMaxAggregateOutputType | null
  }

  type GetConsentGrantGroupByPayload<T extends ConsentGrantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsentGrantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsentGrantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsentGrantGroupByOutputType[P]>
            : GetScalarType<T[P], ConsentGrantGroupByOutputType[P]>
        }
      >
    >


  export type ConsentGrantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    grantedTo?: boolean
    purpose?: boolean
    scope?: boolean
    grantedAt?: boolean
    expiresAt?: boolean
    active?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentGrant"]>

  export type ConsentGrantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    grantedTo?: boolean
    purpose?: boolean
    scope?: boolean
    grantedAt?: boolean
    expiresAt?: boolean
    active?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentGrant"]>

  export type ConsentGrantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    grantedTo?: boolean
    purpose?: boolean
    scope?: boolean
    grantedAt?: boolean
    expiresAt?: boolean
    active?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["consentGrant"]>

  export type ConsentGrantSelectScalar = {
    id?: boolean
    patientId?: boolean
    grantedTo?: boolean
    purpose?: boolean
    scope?: boolean
    grantedAt?: boolean
    expiresAt?: boolean
    active?: boolean
  }

  export type ConsentGrantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "grantedTo" | "purpose" | "scope" | "grantedAt" | "expiresAt" | "active", ExtArgs["result"]["consentGrant"]>
  export type ConsentGrantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }
  export type ConsentGrantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }
  export type ConsentGrantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    doctor?: boolean | DoctorDefaultArgs<ExtArgs>
  }

  export type $ConsentGrantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsentGrant"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      doctor: Prisma.$DoctorPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      grantedTo: string
      purpose: string
      scope: string[]
      grantedAt: Date
      expiresAt: Date
      active: boolean
    }, ExtArgs["result"]["consentGrant"]>
    composites: {}
  }

  type ConsentGrantGetPayload<S extends boolean | null | undefined | ConsentGrantDefaultArgs> = $Result.GetResult<Prisma.$ConsentGrantPayload, S>

  type ConsentGrantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConsentGrantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConsentGrantCountAggregateInputType | true
    }

  export interface ConsentGrantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConsentGrant'], meta: { name: 'ConsentGrant' } }
    /**
     * Find zero or one ConsentGrant that matches the filter.
     * @param {ConsentGrantFindUniqueArgs} args - Arguments to find a ConsentGrant
     * @example
     * // Get one ConsentGrant
     * const consentGrant = await prisma.consentGrant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsentGrantFindUniqueArgs>(args: SelectSubset<T, ConsentGrantFindUniqueArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConsentGrant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConsentGrantFindUniqueOrThrowArgs} args - Arguments to find a ConsentGrant
     * @example
     * // Get one ConsentGrant
     * const consentGrant = await prisma.consentGrant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsentGrantFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsentGrantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsentGrant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGrantFindFirstArgs} args - Arguments to find a ConsentGrant
     * @example
     * // Get one ConsentGrant
     * const consentGrant = await prisma.consentGrant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsentGrantFindFirstArgs>(args?: SelectSubset<T, ConsentGrantFindFirstArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsentGrant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGrantFindFirstOrThrowArgs} args - Arguments to find a ConsentGrant
     * @example
     * // Get one ConsentGrant
     * const consentGrant = await prisma.consentGrant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsentGrantFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsentGrantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConsentGrants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGrantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConsentGrants
     * const consentGrants = await prisma.consentGrant.findMany()
     * 
     * // Get first 10 ConsentGrants
     * const consentGrants = await prisma.consentGrant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consentGrantWithIdOnly = await prisma.consentGrant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsentGrantFindManyArgs>(args?: SelectSubset<T, ConsentGrantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConsentGrant.
     * @param {ConsentGrantCreateArgs} args - Arguments to create a ConsentGrant.
     * @example
     * // Create one ConsentGrant
     * const ConsentGrant = await prisma.consentGrant.create({
     *   data: {
     *     // ... data to create a ConsentGrant
     *   }
     * })
     * 
     */
    create<T extends ConsentGrantCreateArgs>(args: SelectSubset<T, ConsentGrantCreateArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConsentGrants.
     * @param {ConsentGrantCreateManyArgs} args - Arguments to create many ConsentGrants.
     * @example
     * // Create many ConsentGrants
     * const consentGrant = await prisma.consentGrant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsentGrantCreateManyArgs>(args?: SelectSubset<T, ConsentGrantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConsentGrants and returns the data saved in the database.
     * @param {ConsentGrantCreateManyAndReturnArgs} args - Arguments to create many ConsentGrants.
     * @example
     * // Create many ConsentGrants
     * const consentGrant = await prisma.consentGrant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConsentGrants and only return the `id`
     * const consentGrantWithIdOnly = await prisma.consentGrant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsentGrantCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsentGrantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConsentGrant.
     * @param {ConsentGrantDeleteArgs} args - Arguments to delete one ConsentGrant.
     * @example
     * // Delete one ConsentGrant
     * const ConsentGrant = await prisma.consentGrant.delete({
     *   where: {
     *     // ... filter to delete one ConsentGrant
     *   }
     * })
     * 
     */
    delete<T extends ConsentGrantDeleteArgs>(args: SelectSubset<T, ConsentGrantDeleteArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConsentGrant.
     * @param {ConsentGrantUpdateArgs} args - Arguments to update one ConsentGrant.
     * @example
     * // Update one ConsentGrant
     * const consentGrant = await prisma.consentGrant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsentGrantUpdateArgs>(args: SelectSubset<T, ConsentGrantUpdateArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConsentGrants.
     * @param {ConsentGrantDeleteManyArgs} args - Arguments to filter ConsentGrants to delete.
     * @example
     * // Delete a few ConsentGrants
     * const { count } = await prisma.consentGrant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsentGrantDeleteManyArgs>(args?: SelectSubset<T, ConsentGrantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentGrants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGrantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConsentGrants
     * const consentGrant = await prisma.consentGrant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsentGrantUpdateManyArgs>(args: SelectSubset<T, ConsentGrantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentGrants and returns the data updated in the database.
     * @param {ConsentGrantUpdateManyAndReturnArgs} args - Arguments to update many ConsentGrants.
     * @example
     * // Update many ConsentGrants
     * const consentGrant = await prisma.consentGrant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConsentGrants and only return the `id`
     * const consentGrantWithIdOnly = await prisma.consentGrant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConsentGrantUpdateManyAndReturnArgs>(args: SelectSubset<T, ConsentGrantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConsentGrant.
     * @param {ConsentGrantUpsertArgs} args - Arguments to update or create a ConsentGrant.
     * @example
     * // Update or create a ConsentGrant
     * const consentGrant = await prisma.consentGrant.upsert({
     *   create: {
     *     // ... data to create a ConsentGrant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConsentGrant we want to update
     *   }
     * })
     */
    upsert<T extends ConsentGrantUpsertArgs>(args: SelectSubset<T, ConsentGrantUpsertArgs<ExtArgs>>): Prisma__ConsentGrantClient<$Result.GetResult<Prisma.$ConsentGrantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConsentGrants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGrantCountArgs} args - Arguments to filter ConsentGrants to count.
     * @example
     * // Count the number of ConsentGrants
     * const count = await prisma.consentGrant.count({
     *   where: {
     *     // ... the filter for the ConsentGrants we want to count
     *   }
     * })
    **/
    count<T extends ConsentGrantCountArgs>(
      args?: Subset<T, ConsentGrantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsentGrantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConsentGrant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGrantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConsentGrantAggregateArgs>(args: Subset<T, ConsentGrantAggregateArgs>): Prisma.PrismaPromise<GetConsentGrantAggregateType<T>>

    /**
     * Group by ConsentGrant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGrantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConsentGrantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsentGrantGroupByArgs['orderBy'] }
        : { orderBy?: ConsentGrantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConsentGrantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsentGrantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConsentGrant model
   */
  readonly fields: ConsentGrantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConsentGrant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsentGrantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    doctor<T extends DoctorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DoctorDefaultArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConsentGrant model
   */
  interface ConsentGrantFieldRefs {
    readonly id: FieldRef<"ConsentGrant", 'String'>
    readonly patientId: FieldRef<"ConsentGrant", 'String'>
    readonly grantedTo: FieldRef<"ConsentGrant", 'String'>
    readonly purpose: FieldRef<"ConsentGrant", 'String'>
    readonly scope: FieldRef<"ConsentGrant", 'String[]'>
    readonly grantedAt: FieldRef<"ConsentGrant", 'DateTime'>
    readonly expiresAt: FieldRef<"ConsentGrant", 'DateTime'>
    readonly active: FieldRef<"ConsentGrant", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * ConsentGrant findUnique
   */
  export type ConsentGrantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * Filter, which ConsentGrant to fetch.
     */
    where: ConsentGrantWhereUniqueInput
  }

  /**
   * ConsentGrant findUniqueOrThrow
   */
  export type ConsentGrantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * Filter, which ConsentGrant to fetch.
     */
    where: ConsentGrantWhereUniqueInput
  }

  /**
   * ConsentGrant findFirst
   */
  export type ConsentGrantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * Filter, which ConsentGrant to fetch.
     */
    where?: ConsentGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentGrants to fetch.
     */
    orderBy?: ConsentGrantOrderByWithRelationInput | ConsentGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentGrants.
     */
    cursor?: ConsentGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentGrants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentGrants.
     */
    distinct?: ConsentGrantScalarFieldEnum | ConsentGrantScalarFieldEnum[]
  }

  /**
   * ConsentGrant findFirstOrThrow
   */
  export type ConsentGrantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * Filter, which ConsentGrant to fetch.
     */
    where?: ConsentGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentGrants to fetch.
     */
    orderBy?: ConsentGrantOrderByWithRelationInput | ConsentGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentGrants.
     */
    cursor?: ConsentGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentGrants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentGrants.
     */
    distinct?: ConsentGrantScalarFieldEnum | ConsentGrantScalarFieldEnum[]
  }

  /**
   * ConsentGrant findMany
   */
  export type ConsentGrantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * Filter, which ConsentGrants to fetch.
     */
    where?: ConsentGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentGrants to fetch.
     */
    orderBy?: ConsentGrantOrderByWithRelationInput | ConsentGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConsentGrants.
     */
    cursor?: ConsentGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentGrants.
     */
    skip?: number
    distinct?: ConsentGrantScalarFieldEnum | ConsentGrantScalarFieldEnum[]
  }

  /**
   * ConsentGrant create
   */
  export type ConsentGrantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * The data needed to create a ConsentGrant.
     */
    data: XOR<ConsentGrantCreateInput, ConsentGrantUncheckedCreateInput>
  }

  /**
   * ConsentGrant createMany
   */
  export type ConsentGrantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConsentGrants.
     */
    data: ConsentGrantCreateManyInput | ConsentGrantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsentGrant createManyAndReturn
   */
  export type ConsentGrantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * The data used to create many ConsentGrants.
     */
    data: ConsentGrantCreateManyInput | ConsentGrantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConsentGrant update
   */
  export type ConsentGrantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * The data needed to update a ConsentGrant.
     */
    data: XOR<ConsentGrantUpdateInput, ConsentGrantUncheckedUpdateInput>
    /**
     * Choose, which ConsentGrant to update.
     */
    where: ConsentGrantWhereUniqueInput
  }

  /**
   * ConsentGrant updateMany
   */
  export type ConsentGrantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConsentGrants.
     */
    data: XOR<ConsentGrantUpdateManyMutationInput, ConsentGrantUncheckedUpdateManyInput>
    /**
     * Filter which ConsentGrants to update
     */
    where?: ConsentGrantWhereInput
    /**
     * Limit how many ConsentGrants to update.
     */
    limit?: number
  }

  /**
   * ConsentGrant updateManyAndReturn
   */
  export type ConsentGrantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * The data used to update ConsentGrants.
     */
    data: XOR<ConsentGrantUpdateManyMutationInput, ConsentGrantUncheckedUpdateManyInput>
    /**
     * Filter which ConsentGrants to update
     */
    where?: ConsentGrantWhereInput
    /**
     * Limit how many ConsentGrants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConsentGrant upsert
   */
  export type ConsentGrantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * The filter to search for the ConsentGrant to update in case it exists.
     */
    where: ConsentGrantWhereUniqueInput
    /**
     * In case the ConsentGrant found by the `where` argument doesn't exist, create a new ConsentGrant with this data.
     */
    create: XOR<ConsentGrantCreateInput, ConsentGrantUncheckedCreateInput>
    /**
     * In case the ConsentGrant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsentGrantUpdateInput, ConsentGrantUncheckedUpdateInput>
  }

  /**
   * ConsentGrant delete
   */
  export type ConsentGrantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
    /**
     * Filter which ConsentGrant to delete.
     */
    where: ConsentGrantWhereUniqueInput
  }

  /**
   * ConsentGrant deleteMany
   */
  export type ConsentGrantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentGrants to delete
     */
    where?: ConsentGrantWhereInput
    /**
     * Limit how many ConsentGrants to delete.
     */
    limit?: number
  }

  /**
   * ConsentGrant without action
   */
  export type ConsentGrantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentGrant
     */
    select?: ConsentGrantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsentGrant
     */
    omit?: ConsentGrantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentGrantInclude<ExtArgs> | null
  }


  /**
   * Model AuditEvent
   */

  export type AggregateAuditEvent = {
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  export type AuditEventMinAggregateOutputType = {
    id: string | null
    actorId: string | null
    actorName: string | null
    action: string | null
    target: string | null
    reason: string | null
    at: Date | null
  }

  export type AuditEventMaxAggregateOutputType = {
    id: string | null
    actorId: string | null
    actorName: string | null
    action: string | null
    target: string | null
    reason: string | null
    at: Date | null
  }

  export type AuditEventCountAggregateOutputType = {
    id: number
    actorId: number
    actorName: number
    action: number
    target: number
    reason: number
    at: number
    _all: number
  }


  export type AuditEventMinAggregateInputType = {
    id?: true
    actorId?: true
    actorName?: true
    action?: true
    target?: true
    reason?: true
    at?: true
  }

  export type AuditEventMaxAggregateInputType = {
    id?: true
    actorId?: true
    actorName?: true
    action?: true
    target?: true
    reason?: true
    at?: true
  }

  export type AuditEventCountAggregateInputType = {
    id?: true
    actorId?: true
    actorName?: true
    action?: true
    target?: true
    reason?: true
    at?: true
    _all?: true
  }

  export type AuditEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvent to aggregate.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditEvents
    **/
    _count?: true | AuditEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditEventMaxAggregateInputType
  }

  export type GetAuditEventAggregateType<T extends AuditEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditEvent[P]>
      : GetScalarType<T[P], AggregateAuditEvent[P]>
  }




  export type AuditEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithAggregationInput | AuditEventOrderByWithAggregationInput[]
    by: AuditEventScalarFieldEnum[] | AuditEventScalarFieldEnum
    having?: AuditEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditEventCountAggregateInputType | true
    _min?: AuditEventMinAggregateInputType
    _max?: AuditEventMaxAggregateInputType
  }

  export type AuditEventGroupByOutputType = {
    id: string
    actorId: string | null
    actorName: string
    action: string
    target: string
    reason: string | null
    at: Date
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  type GetAuditEventGroupByPayload<T extends AuditEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
            : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
        }
      >
    >


  export type AuditEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    actorName?: boolean
    action?: boolean
    target?: boolean
    reason?: boolean
    at?: boolean
    doctor?: boolean | AuditEvent$doctorArgs<ExtArgs>
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    actorName?: boolean
    action?: boolean
    target?: boolean
    reason?: boolean
    at?: boolean
    doctor?: boolean | AuditEvent$doctorArgs<ExtArgs>
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorId?: boolean
    actorName?: boolean
    action?: boolean
    target?: boolean
    reason?: boolean
    at?: boolean
    doctor?: boolean | AuditEvent$doctorArgs<ExtArgs>
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectScalar = {
    id?: boolean
    actorId?: boolean
    actorName?: boolean
    action?: boolean
    target?: boolean
    reason?: boolean
    at?: boolean
  }

  export type AuditEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "actorId" | "actorName" | "action" | "target" | "reason" | "at", ExtArgs["result"]["auditEvent"]>
  export type AuditEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    doctor?: boolean | AuditEvent$doctorArgs<ExtArgs>
  }
  export type AuditEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    doctor?: boolean | AuditEvent$doctorArgs<ExtArgs>
  }
  export type AuditEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    doctor?: boolean | AuditEvent$doctorArgs<ExtArgs>
  }

  export type $AuditEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditEvent"
    objects: {
      doctor: Prisma.$DoctorPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      actorId: string | null
      actorName: string
      action: string
      target: string
      reason: string | null
      at: Date
    }, ExtArgs["result"]["auditEvent"]>
    composites: {}
  }

  type AuditEventGetPayload<S extends boolean | null | undefined | AuditEventDefaultArgs> = $Result.GetResult<Prisma.$AuditEventPayload, S>

  type AuditEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditEventCountAggregateInputType | true
    }

  export interface AuditEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditEvent'], meta: { name: 'AuditEvent' } }
    /**
     * Find zero or one AuditEvent that matches the filter.
     * @param {AuditEventFindUniqueArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditEventFindUniqueArgs>(args: SelectSubset<T, AuditEventFindUniqueArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditEventFindUniqueOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditEventFindFirstArgs>(args?: SelectSubset<T, AuditEventFindFirstArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany()
     * 
     * // Get first 10 AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditEventFindManyArgs>(args?: SelectSubset<T, AuditEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditEvent.
     * @param {AuditEventCreateArgs} args - Arguments to create a AuditEvent.
     * @example
     * // Create one AuditEvent
     * const AuditEvent = await prisma.auditEvent.create({
     *   data: {
     *     // ... data to create a AuditEvent
     *   }
     * })
     * 
     */
    create<T extends AuditEventCreateArgs>(args: SelectSubset<T, AuditEventCreateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditEvents.
     * @param {AuditEventCreateManyArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditEventCreateManyArgs>(args?: SelectSubset<T, AuditEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditEvents and returns the data saved in the database.
     * @param {AuditEventCreateManyAndReturnArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditEvent.
     * @param {AuditEventDeleteArgs} args - Arguments to delete one AuditEvent.
     * @example
     * // Delete one AuditEvent
     * const AuditEvent = await prisma.auditEvent.delete({
     *   where: {
     *     // ... filter to delete one AuditEvent
     *   }
     * })
     * 
     */
    delete<T extends AuditEventDeleteArgs>(args: SelectSubset<T, AuditEventDeleteArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditEvent.
     * @param {AuditEventUpdateArgs} args - Arguments to update one AuditEvent.
     * @example
     * // Update one AuditEvent
     * const auditEvent = await prisma.auditEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditEventUpdateArgs>(args: SelectSubset<T, AuditEventUpdateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditEvents.
     * @param {AuditEventDeleteManyArgs} args - Arguments to filter AuditEvents to delete.
     * @example
     * // Delete a few AuditEvents
     * const { count } = await prisma.auditEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditEventDeleteManyArgs>(args?: SelectSubset<T, AuditEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditEventUpdateManyArgs>(args: SelectSubset<T, AuditEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents and returns the data updated in the database.
     * @param {AuditEventUpdateManyAndReturnArgs} args - Arguments to update many AuditEvents.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditEvent.
     * @param {AuditEventUpsertArgs} args - Arguments to update or create a AuditEvent.
     * @example
     * // Update or create a AuditEvent
     * const auditEvent = await prisma.auditEvent.upsert({
     *   create: {
     *     // ... data to create a AuditEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditEvent we want to update
     *   }
     * })
     */
    upsert<T extends AuditEventUpsertArgs>(args: SelectSubset<T, AuditEventUpsertArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventCountArgs} args - Arguments to filter AuditEvents to count.
     * @example
     * // Count the number of AuditEvents
     * const count = await prisma.auditEvent.count({
     *   where: {
     *     // ... the filter for the AuditEvents we want to count
     *   }
     * })
    **/
    count<T extends AuditEventCountArgs>(
      args?: Subset<T, AuditEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditEventAggregateArgs>(args: Subset<T, AuditEventAggregateArgs>): Prisma.PrismaPromise<GetAuditEventAggregateType<T>>

    /**
     * Group by AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditEventGroupByArgs['orderBy'] }
        : { orderBy?: AuditEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditEvent model
   */
  readonly fields: AuditEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    doctor<T extends AuditEvent$doctorArgs<ExtArgs> = {}>(args?: Subset<T, AuditEvent$doctorArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditEvent model
   */
  interface AuditEventFieldRefs {
    readonly id: FieldRef<"AuditEvent", 'String'>
    readonly actorId: FieldRef<"AuditEvent", 'String'>
    readonly actorName: FieldRef<"AuditEvent", 'String'>
    readonly action: FieldRef<"AuditEvent", 'String'>
    readonly target: FieldRef<"AuditEvent", 'String'>
    readonly reason: FieldRef<"AuditEvent", 'String'>
    readonly at: FieldRef<"AuditEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditEvent findUnique
   */
  export type AuditEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findUniqueOrThrow
   */
  export type AuditEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findFirst
   */
  export type AuditEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findFirstOrThrow
   */
  export type AuditEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findMany
   */
  export type AuditEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter, which AuditEvents to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent create
   */
  export type AuditEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditEvent.
     */
    data: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
  }

  /**
   * AuditEvent createMany
   */
  export type AuditEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent createManyAndReturn
   */
  export type AuditEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditEvent update
   */
  export type AuditEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditEvent.
     */
    data: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
    /**
     * Choose, which AuditEvent to update.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent updateMany
   */
  export type AuditEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to update.
     */
    limit?: number
  }

  /**
   * AuditEvent updateManyAndReturn
   */
  export type AuditEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditEvent upsert
   */
  export type AuditEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditEvent to update in case it exists.
     */
    where: AuditEventWhereUniqueInput
    /**
     * In case the AuditEvent found by the `where` argument doesn't exist, create a new AuditEvent with this data.
     */
    create: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
    /**
     * In case the AuditEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
  }

  /**
   * AuditEvent delete
   */
  export type AuditEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    /**
     * Filter which AuditEvent to delete.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent deleteMany
   */
  export type AuditEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvents to delete
     */
    where?: AuditEventWhereInput
    /**
     * Limit how many AuditEvents to delete.
     */
    limit?: number
  }

  /**
   * AuditEvent.doctor
   */
  export type AuditEvent$doctorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    where?: DoctorWhereInput
  }

  /**
   * AuditEvent without action
   */
  export type AuditEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditEvent
     */
    omit?: AuditEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    authUserId: 'authUserId',
    expoPushToken: 'expoPushToken',
    createdAt: 'createdAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const DoctorScalarFieldEnum: {
    id: 'id',
    authUserId: 'authUserId',
    fullName: 'fullName',
    email: 'email',
    passwordHash: 'passwordHash',
    specialty: 'specialty',
    registrationNo: 'registrationNo',
    languages: 'languages',
    clinicName: 'clinicName',
    mfaEnabled: 'mfaEnabled',
    avatarTone: 'avatarTone',
    onboardingComplete: 'onboardingComplete',
    country: 'country',
    profile: 'profile',
    onCall: 'onCall',
    lastSeenAt: 'lastSeenAt',
    createdAt: 'createdAt'
  };

  export type DoctorScalarFieldEnum = (typeof DoctorScalarFieldEnum)[keyof typeof DoctorScalarFieldEnum]


  export const PharmacyScalarFieldEnum: {
    id: 'id',
    authUserId: 'authUserId',
    name: 'name',
    email: 'email',
    licenseNo: 'licenseNo',
    ownerName: 'ownerName',
    phone: 'phone',
    city: 'city',
    district: 'district',
    state: 'state',
    country: 'country',
    services: 'services',
    avatarTone: 'avatarTone',
    onboardingComplete: 'onboardingComplete',
    verified: 'verified',
    profile: 'profile',
    createdAt: 'createdAt'
  };

  export type PharmacyScalarFieldEnum = (typeof PharmacyScalarFieldEnum)[keyof typeof PharmacyScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    fullName: 'fullName',
    sex: 'sex',
    dateOfBirth: 'dateOfBirth',
    phoneMasked: 'phoneMasked',
    village: 'village',
    district: 'district',
    preferredLanguage: 'preferredLanguage',
    abhaLinked: 'abhaLinked',
    relationshipToAccount: 'relationshipToAccount',
    allergies: 'allergies',
    conditions: 'conditions',
    currentMedications: 'currentMedications',
    avatarTone: 'avatarTone'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const AriaHandoverScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    createdAt: 'createdAt',
    chiefComplaint: 'chiefComplaint',
    narrative: 'narrative',
    durationText: 'durationText',
    symptoms: 'symptoms',
    redFlags: 'redFlags',
    vitals: 'vitals',
    aiConfidence: 'aiConfidence',
    suggestedTriage: 'suggestedTriage',
    language: 'language',
    verifiedByDoctor: 'verifiedByDoctor'
  };

  export type AriaHandoverScalarFieldEnum = (typeof AriaHandoverScalarFieldEnum)[keyof typeof AriaHandoverScalarFieldEnum]


  export const QueueEntryScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    doctorId: 'doctorId',
    kind: 'kind',
    triage: 'triage',
    state: 'state',
    checkedInAt: 'checkedInAt',
    scheduledFor: 'scheduledFor',
    channel: 'channel',
    reason: 'reason',
    connectionQuality: 'connectionQuality',
    handoverId: 'handoverId'
  };

  export type QueueEntryScalarFieldEnum = (typeof QueueEntryScalarFieldEnum)[keyof typeof QueueEntryScalarFieldEnum]


  export const EncounterScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    doctorId: 'doctorId',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    channel: 'channel',
    chiefComplaint: 'chiefComplaint',
    assessment: 'assessment',
    clinicalNotes: 'clinicalNotes',
    prescriptions: 'prescriptions',
    labRequests: 'labRequests',
    followUp: 'followUp',
    ariaAccepted: 'ariaAccepted'
  };

  export type EncounterScalarFieldEnum = (typeof EncounterScalarFieldEnum)[keyof typeof EncounterScalarFieldEnum]


  export const ConsentGrantScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    grantedTo: 'grantedTo',
    purpose: 'purpose',
    scope: 'scope',
    grantedAt: 'grantedAt',
    expiresAt: 'expiresAt',
    active: 'active'
  };

  export type ConsentGrantScalarFieldEnum = (typeof ConsentGrantScalarFieldEnum)[keyof typeof ConsentGrantScalarFieldEnum]


  export const AuditEventScalarFieldEnum: {
    id: 'id',
    actorId: 'actorId',
    actorName: 'actorName',
    action: 'action',
    target: 'target',
    reason: 'reason',
    at: 'at'
  };

  export type AuditEventScalarFieldEnum = (typeof AuditEventScalarFieldEnum)[keyof typeof AuditEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Sex'
   */
  export type EnumSexFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sex'>
    


  /**
   * Reference to a field of type 'Sex[]'
   */
  export type ListEnumSexFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Sex[]'>
    


  /**
   * Reference to a field of type 'RelationshipRole'
   */
  export type EnumRelationshipRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RelationshipRole'>
    


  /**
   * Reference to a field of type 'RelationshipRole[]'
   */
  export type ListEnumRelationshipRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RelationshipRole[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'TriageLevel'
   */
  export type EnumTriageLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TriageLevel'>
    


  /**
   * Reference to a field of type 'TriageLevel[]'
   */
  export type ListEnumTriageLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TriageLevel[]'>
    


  /**
   * Reference to a field of type 'EncounterKind'
   */
  export type EnumEncounterKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EncounterKind'>
    


  /**
   * Reference to a field of type 'EncounterKind[]'
   */
  export type ListEnumEncounterKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EncounterKind[]'>
    


  /**
   * Reference to a field of type 'QueueState'
   */
  export type EnumQueueStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueueState'>
    


  /**
   * Reference to a field of type 'QueueState[]'
   */
  export type ListEnumQueueStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueueState[]'>
    


  /**
   * Reference to a field of type 'ConsultChannel'
   */
  export type EnumConsultChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsultChannel'>
    


  /**
   * Reference to a field of type 'ConsultChannel[]'
   */
  export type ListEnumConsultChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsultChannel[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    phone?: StringFilter<"Account"> | string
    authUserId?: UuidNullableFilter<"Account"> | string | null
    expoPushToken?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    patients?: PatientListRelationFilter
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    authUserId?: SortOrderInput | SortOrder
    expoPushToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    patients?: PatientOrderByRelationAggregateInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    authUserId?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    expoPushToken?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    patients?: PatientListRelationFilter
  }, "id" | "phone" | "authUserId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    authUserId?: SortOrderInput | SortOrder
    expoPushToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    phone?: StringWithAggregatesFilter<"Account"> | string
    authUserId?: UuidNullableWithAggregatesFilter<"Account"> | string | null
    expoPushToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type DoctorWhereInput = {
    AND?: DoctorWhereInput | DoctorWhereInput[]
    OR?: DoctorWhereInput[]
    NOT?: DoctorWhereInput | DoctorWhereInput[]
    id?: StringFilter<"Doctor"> | string
    authUserId?: UuidNullableFilter<"Doctor"> | string | null
    fullName?: StringFilter<"Doctor"> | string
    email?: StringFilter<"Doctor"> | string
    passwordHash?: StringNullableFilter<"Doctor"> | string | null
    specialty?: StringFilter<"Doctor"> | string
    registrationNo?: StringFilter<"Doctor"> | string
    languages?: StringNullableListFilter<"Doctor">
    clinicName?: StringFilter<"Doctor"> | string
    mfaEnabled?: BoolFilter<"Doctor"> | boolean
    avatarTone?: StringNullableFilter<"Doctor"> | string | null
    onboardingComplete?: BoolFilter<"Doctor"> | boolean
    country?: StringNullableFilter<"Doctor"> | string | null
    profile?: JsonNullableFilter<"Doctor">
    onCall?: BoolFilter<"Doctor"> | boolean
    lastSeenAt?: DateTimeNullableFilter<"Doctor"> | Date | string | null
    createdAt?: DateTimeFilter<"Doctor"> | Date | string
    queue?: QueueEntryListRelationFilter
    encounters?: EncounterListRelationFilter
    consents?: ConsentGrantListRelationFilter
    audits?: AuditEventListRelationFilter
  }

  export type DoctorOrderByWithRelationInput = {
    id?: SortOrder
    authUserId?: SortOrderInput | SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    specialty?: SortOrder
    registrationNo?: SortOrder
    languages?: SortOrder
    clinicName?: SortOrder
    mfaEnabled?: SortOrder
    avatarTone?: SortOrderInput | SortOrder
    onboardingComplete?: SortOrder
    country?: SortOrderInput | SortOrder
    profile?: SortOrderInput | SortOrder
    onCall?: SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    queue?: QueueEntryOrderByRelationAggregateInput
    encounters?: EncounterOrderByRelationAggregateInput
    consents?: ConsentGrantOrderByRelationAggregateInput
    audits?: AuditEventOrderByRelationAggregateInput
  }

  export type DoctorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    authUserId?: string
    email?: string
    registrationNo?: string
    AND?: DoctorWhereInput | DoctorWhereInput[]
    OR?: DoctorWhereInput[]
    NOT?: DoctorWhereInput | DoctorWhereInput[]
    fullName?: StringFilter<"Doctor"> | string
    passwordHash?: StringNullableFilter<"Doctor"> | string | null
    specialty?: StringFilter<"Doctor"> | string
    languages?: StringNullableListFilter<"Doctor">
    clinicName?: StringFilter<"Doctor"> | string
    mfaEnabled?: BoolFilter<"Doctor"> | boolean
    avatarTone?: StringNullableFilter<"Doctor"> | string | null
    onboardingComplete?: BoolFilter<"Doctor"> | boolean
    country?: StringNullableFilter<"Doctor"> | string | null
    profile?: JsonNullableFilter<"Doctor">
    onCall?: BoolFilter<"Doctor"> | boolean
    lastSeenAt?: DateTimeNullableFilter<"Doctor"> | Date | string | null
    createdAt?: DateTimeFilter<"Doctor"> | Date | string
    queue?: QueueEntryListRelationFilter
    encounters?: EncounterListRelationFilter
    consents?: ConsentGrantListRelationFilter
    audits?: AuditEventListRelationFilter
  }, "id" | "authUserId" | "email" | "registrationNo">

  export type DoctorOrderByWithAggregationInput = {
    id?: SortOrder
    authUserId?: SortOrderInput | SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    specialty?: SortOrder
    registrationNo?: SortOrder
    languages?: SortOrder
    clinicName?: SortOrder
    mfaEnabled?: SortOrder
    avatarTone?: SortOrderInput | SortOrder
    onboardingComplete?: SortOrder
    country?: SortOrderInput | SortOrder
    profile?: SortOrderInput | SortOrder
    onCall?: SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DoctorCountOrderByAggregateInput
    _max?: DoctorMaxOrderByAggregateInput
    _min?: DoctorMinOrderByAggregateInput
  }

  export type DoctorScalarWhereWithAggregatesInput = {
    AND?: DoctorScalarWhereWithAggregatesInput | DoctorScalarWhereWithAggregatesInput[]
    OR?: DoctorScalarWhereWithAggregatesInput[]
    NOT?: DoctorScalarWhereWithAggregatesInput | DoctorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Doctor"> | string
    authUserId?: UuidNullableWithAggregatesFilter<"Doctor"> | string | null
    fullName?: StringWithAggregatesFilter<"Doctor"> | string
    email?: StringWithAggregatesFilter<"Doctor"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"Doctor"> | string | null
    specialty?: StringWithAggregatesFilter<"Doctor"> | string
    registrationNo?: StringWithAggregatesFilter<"Doctor"> | string
    languages?: StringNullableListFilter<"Doctor">
    clinicName?: StringWithAggregatesFilter<"Doctor"> | string
    mfaEnabled?: BoolWithAggregatesFilter<"Doctor"> | boolean
    avatarTone?: StringNullableWithAggregatesFilter<"Doctor"> | string | null
    onboardingComplete?: BoolWithAggregatesFilter<"Doctor"> | boolean
    country?: StringNullableWithAggregatesFilter<"Doctor"> | string | null
    profile?: JsonNullableWithAggregatesFilter<"Doctor">
    onCall?: BoolWithAggregatesFilter<"Doctor"> | boolean
    lastSeenAt?: DateTimeNullableWithAggregatesFilter<"Doctor"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Doctor"> | Date | string
  }

  export type PharmacyWhereInput = {
    AND?: PharmacyWhereInput | PharmacyWhereInput[]
    OR?: PharmacyWhereInput[]
    NOT?: PharmacyWhereInput | PharmacyWhereInput[]
    id?: StringFilter<"Pharmacy"> | string
    authUserId?: UuidNullableFilter<"Pharmacy"> | string | null
    name?: StringFilter<"Pharmacy"> | string
    email?: StringFilter<"Pharmacy"> | string
    licenseNo?: StringFilter<"Pharmacy"> | string
    ownerName?: StringFilter<"Pharmacy"> | string
    phone?: StringNullableFilter<"Pharmacy"> | string | null
    city?: StringNullableFilter<"Pharmacy"> | string | null
    district?: StringNullableFilter<"Pharmacy"> | string | null
    state?: StringNullableFilter<"Pharmacy"> | string | null
    country?: StringNullableFilter<"Pharmacy"> | string | null
    services?: StringNullableListFilter<"Pharmacy">
    avatarTone?: StringNullableFilter<"Pharmacy"> | string | null
    onboardingComplete?: BoolFilter<"Pharmacy"> | boolean
    verified?: BoolFilter<"Pharmacy"> | boolean
    profile?: JsonNullableFilter<"Pharmacy">
    createdAt?: DateTimeFilter<"Pharmacy"> | Date | string
  }

  export type PharmacyOrderByWithRelationInput = {
    id?: SortOrder
    authUserId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    licenseNo?: SortOrder
    ownerName?: SortOrder
    phone?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    services?: SortOrder
    avatarTone?: SortOrderInput | SortOrder
    onboardingComplete?: SortOrder
    verified?: SortOrder
    profile?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type PharmacyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    authUserId?: string
    email?: string
    licenseNo?: string
    AND?: PharmacyWhereInput | PharmacyWhereInput[]
    OR?: PharmacyWhereInput[]
    NOT?: PharmacyWhereInput | PharmacyWhereInput[]
    name?: StringFilter<"Pharmacy"> | string
    ownerName?: StringFilter<"Pharmacy"> | string
    phone?: StringNullableFilter<"Pharmacy"> | string | null
    city?: StringNullableFilter<"Pharmacy"> | string | null
    district?: StringNullableFilter<"Pharmacy"> | string | null
    state?: StringNullableFilter<"Pharmacy"> | string | null
    country?: StringNullableFilter<"Pharmacy"> | string | null
    services?: StringNullableListFilter<"Pharmacy">
    avatarTone?: StringNullableFilter<"Pharmacy"> | string | null
    onboardingComplete?: BoolFilter<"Pharmacy"> | boolean
    verified?: BoolFilter<"Pharmacy"> | boolean
    profile?: JsonNullableFilter<"Pharmacy">
    createdAt?: DateTimeFilter<"Pharmacy"> | Date | string
  }, "id" | "authUserId" | "email" | "licenseNo">

  export type PharmacyOrderByWithAggregationInput = {
    id?: SortOrder
    authUserId?: SortOrderInput | SortOrder
    name?: SortOrder
    email?: SortOrder
    licenseNo?: SortOrder
    ownerName?: SortOrder
    phone?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    district?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    services?: SortOrder
    avatarTone?: SortOrderInput | SortOrder
    onboardingComplete?: SortOrder
    verified?: SortOrder
    profile?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PharmacyCountOrderByAggregateInput
    _max?: PharmacyMaxOrderByAggregateInput
    _min?: PharmacyMinOrderByAggregateInput
  }

  export type PharmacyScalarWhereWithAggregatesInput = {
    AND?: PharmacyScalarWhereWithAggregatesInput | PharmacyScalarWhereWithAggregatesInput[]
    OR?: PharmacyScalarWhereWithAggregatesInput[]
    NOT?: PharmacyScalarWhereWithAggregatesInput | PharmacyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Pharmacy"> | string
    authUserId?: UuidNullableWithAggregatesFilter<"Pharmacy"> | string | null
    name?: StringWithAggregatesFilter<"Pharmacy"> | string
    email?: StringWithAggregatesFilter<"Pharmacy"> | string
    licenseNo?: StringWithAggregatesFilter<"Pharmacy"> | string
    ownerName?: StringWithAggregatesFilter<"Pharmacy"> | string
    phone?: StringNullableWithAggregatesFilter<"Pharmacy"> | string | null
    city?: StringNullableWithAggregatesFilter<"Pharmacy"> | string | null
    district?: StringNullableWithAggregatesFilter<"Pharmacy"> | string | null
    state?: StringNullableWithAggregatesFilter<"Pharmacy"> | string | null
    country?: StringNullableWithAggregatesFilter<"Pharmacy"> | string | null
    services?: StringNullableListFilter<"Pharmacy">
    avatarTone?: StringNullableWithAggregatesFilter<"Pharmacy"> | string | null
    onboardingComplete?: BoolWithAggregatesFilter<"Pharmacy"> | boolean
    verified?: BoolWithAggregatesFilter<"Pharmacy"> | boolean
    profile?: JsonNullableWithAggregatesFilter<"Pharmacy">
    createdAt?: DateTimeWithAggregatesFilter<"Pharmacy"> | Date | string
  }

  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: StringFilter<"Patient"> | string
    accountId?: StringFilter<"Patient"> | string
    fullName?: StringFilter<"Patient"> | string
    sex?: EnumSexFilter<"Patient"> | $Enums.Sex
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    phoneMasked?: StringFilter<"Patient"> | string
    village?: StringFilter<"Patient"> | string
    district?: StringFilter<"Patient"> | string
    preferredLanguage?: StringFilter<"Patient"> | string
    abhaLinked?: BoolFilter<"Patient"> | boolean
    relationshipToAccount?: EnumRelationshipRoleFilter<"Patient"> | $Enums.RelationshipRole
    allergies?: StringNullableListFilter<"Patient">
    conditions?: StringNullableListFilter<"Patient">
    currentMedications?: StringNullableListFilter<"Patient">
    avatarTone?: StringNullableFilter<"Patient"> | string | null
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
    handovers?: AriaHandoverListRelationFilter
    queueEntries?: QueueEntryListRelationFilter
    encounters?: EncounterListRelationFilter
    consents?: ConsentGrantListRelationFilter
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    phoneMasked?: SortOrder
    village?: SortOrder
    district?: SortOrder
    preferredLanguage?: SortOrder
    abhaLinked?: SortOrder
    relationshipToAccount?: SortOrder
    allergies?: SortOrder
    conditions?: SortOrder
    currentMedications?: SortOrder
    avatarTone?: SortOrderInput | SortOrder
    account?: AccountOrderByWithRelationInput
    handovers?: AriaHandoverOrderByRelationAggregateInput
    queueEntries?: QueueEntryOrderByRelationAggregateInput
    encounters?: EncounterOrderByRelationAggregateInput
    consents?: ConsentGrantOrderByRelationAggregateInput
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    accountId?: StringFilter<"Patient"> | string
    fullName?: StringFilter<"Patient"> | string
    sex?: EnumSexFilter<"Patient"> | $Enums.Sex
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    phoneMasked?: StringFilter<"Patient"> | string
    village?: StringFilter<"Patient"> | string
    district?: StringFilter<"Patient"> | string
    preferredLanguage?: StringFilter<"Patient"> | string
    abhaLinked?: BoolFilter<"Patient"> | boolean
    relationshipToAccount?: EnumRelationshipRoleFilter<"Patient"> | $Enums.RelationshipRole
    allergies?: StringNullableListFilter<"Patient">
    conditions?: StringNullableListFilter<"Patient">
    currentMedications?: StringNullableListFilter<"Patient">
    avatarTone?: StringNullableFilter<"Patient"> | string | null
    account?: XOR<AccountScalarRelationFilter, AccountWhereInput>
    handovers?: AriaHandoverListRelationFilter
    queueEntries?: QueueEntryListRelationFilter
    encounters?: EncounterListRelationFilter
    consents?: ConsentGrantListRelationFilter
  }, "id">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    phoneMasked?: SortOrder
    village?: SortOrder
    district?: SortOrder
    preferredLanguage?: SortOrder
    abhaLinked?: SortOrder
    relationshipToAccount?: SortOrder
    allergies?: SortOrder
    conditions?: SortOrder
    currentMedications?: SortOrder
    avatarTone?: SortOrderInput | SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Patient"> | string
    accountId?: StringWithAggregatesFilter<"Patient"> | string
    fullName?: StringWithAggregatesFilter<"Patient"> | string
    sex?: EnumSexWithAggregatesFilter<"Patient"> | $Enums.Sex
    dateOfBirth?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    phoneMasked?: StringWithAggregatesFilter<"Patient"> | string
    village?: StringWithAggregatesFilter<"Patient"> | string
    district?: StringWithAggregatesFilter<"Patient"> | string
    preferredLanguage?: StringWithAggregatesFilter<"Patient"> | string
    abhaLinked?: BoolWithAggregatesFilter<"Patient"> | boolean
    relationshipToAccount?: EnumRelationshipRoleWithAggregatesFilter<"Patient"> | $Enums.RelationshipRole
    allergies?: StringNullableListFilter<"Patient">
    conditions?: StringNullableListFilter<"Patient">
    currentMedications?: StringNullableListFilter<"Patient">
    avatarTone?: StringNullableWithAggregatesFilter<"Patient"> | string | null
  }

  export type AriaHandoverWhereInput = {
    AND?: AriaHandoverWhereInput | AriaHandoverWhereInput[]
    OR?: AriaHandoverWhereInput[]
    NOT?: AriaHandoverWhereInput | AriaHandoverWhereInput[]
    id?: StringFilter<"AriaHandover"> | string
    patientId?: StringFilter<"AriaHandover"> | string
    createdAt?: DateTimeFilter<"AriaHandover"> | Date | string
    chiefComplaint?: StringFilter<"AriaHandover"> | string
    narrative?: StringFilter<"AriaHandover"> | string
    durationText?: StringFilter<"AriaHandover"> | string
    symptoms?: StringNullableListFilter<"AriaHandover">
    redFlags?: StringNullableListFilter<"AriaHandover">
    vitals?: JsonNullableFilter<"AriaHandover">
    aiConfidence?: FloatFilter<"AriaHandover"> | number
    suggestedTriage?: EnumTriageLevelFilter<"AriaHandover"> | $Enums.TriageLevel
    language?: StringFilter<"AriaHandover"> | string
    verifiedByDoctor?: BoolFilter<"AriaHandover"> | boolean
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    queueEntry?: XOR<QueueEntryNullableScalarRelationFilter, QueueEntryWhereInput> | null
  }

  export type AriaHandoverOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    createdAt?: SortOrder
    chiefComplaint?: SortOrder
    narrative?: SortOrder
    durationText?: SortOrder
    symptoms?: SortOrder
    redFlags?: SortOrder
    vitals?: SortOrderInput | SortOrder
    aiConfidence?: SortOrder
    suggestedTriage?: SortOrder
    language?: SortOrder
    verifiedByDoctor?: SortOrder
    patient?: PatientOrderByWithRelationInput
    queueEntry?: QueueEntryOrderByWithRelationInput
  }

  export type AriaHandoverWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AriaHandoverWhereInput | AriaHandoverWhereInput[]
    OR?: AriaHandoverWhereInput[]
    NOT?: AriaHandoverWhereInput | AriaHandoverWhereInput[]
    patientId?: StringFilter<"AriaHandover"> | string
    createdAt?: DateTimeFilter<"AriaHandover"> | Date | string
    chiefComplaint?: StringFilter<"AriaHandover"> | string
    narrative?: StringFilter<"AriaHandover"> | string
    durationText?: StringFilter<"AriaHandover"> | string
    symptoms?: StringNullableListFilter<"AriaHandover">
    redFlags?: StringNullableListFilter<"AriaHandover">
    vitals?: JsonNullableFilter<"AriaHandover">
    aiConfidence?: FloatFilter<"AriaHandover"> | number
    suggestedTriage?: EnumTriageLevelFilter<"AriaHandover"> | $Enums.TriageLevel
    language?: StringFilter<"AriaHandover"> | string
    verifiedByDoctor?: BoolFilter<"AriaHandover"> | boolean
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    queueEntry?: XOR<QueueEntryNullableScalarRelationFilter, QueueEntryWhereInput> | null
  }, "id">

  export type AriaHandoverOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    createdAt?: SortOrder
    chiefComplaint?: SortOrder
    narrative?: SortOrder
    durationText?: SortOrder
    symptoms?: SortOrder
    redFlags?: SortOrder
    vitals?: SortOrderInput | SortOrder
    aiConfidence?: SortOrder
    suggestedTriage?: SortOrder
    language?: SortOrder
    verifiedByDoctor?: SortOrder
    _count?: AriaHandoverCountOrderByAggregateInput
    _avg?: AriaHandoverAvgOrderByAggregateInput
    _max?: AriaHandoverMaxOrderByAggregateInput
    _min?: AriaHandoverMinOrderByAggregateInput
    _sum?: AriaHandoverSumOrderByAggregateInput
  }

  export type AriaHandoverScalarWhereWithAggregatesInput = {
    AND?: AriaHandoverScalarWhereWithAggregatesInput | AriaHandoverScalarWhereWithAggregatesInput[]
    OR?: AriaHandoverScalarWhereWithAggregatesInput[]
    NOT?: AriaHandoverScalarWhereWithAggregatesInput | AriaHandoverScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AriaHandover"> | string
    patientId?: StringWithAggregatesFilter<"AriaHandover"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AriaHandover"> | Date | string
    chiefComplaint?: StringWithAggregatesFilter<"AriaHandover"> | string
    narrative?: StringWithAggregatesFilter<"AriaHandover"> | string
    durationText?: StringWithAggregatesFilter<"AriaHandover"> | string
    symptoms?: StringNullableListFilter<"AriaHandover">
    redFlags?: StringNullableListFilter<"AriaHandover">
    vitals?: JsonNullableWithAggregatesFilter<"AriaHandover">
    aiConfidence?: FloatWithAggregatesFilter<"AriaHandover"> | number
    suggestedTriage?: EnumTriageLevelWithAggregatesFilter<"AriaHandover"> | $Enums.TriageLevel
    language?: StringWithAggregatesFilter<"AriaHandover"> | string
    verifiedByDoctor?: BoolWithAggregatesFilter<"AriaHandover"> | boolean
  }

  export type QueueEntryWhereInput = {
    AND?: QueueEntryWhereInput | QueueEntryWhereInput[]
    OR?: QueueEntryWhereInput[]
    NOT?: QueueEntryWhereInput | QueueEntryWhereInput[]
    id?: StringFilter<"QueueEntry"> | string
    patientId?: StringFilter<"QueueEntry"> | string
    doctorId?: StringNullableFilter<"QueueEntry"> | string | null
    kind?: EnumEncounterKindFilter<"QueueEntry"> | $Enums.EncounterKind
    triage?: EnumTriageLevelFilter<"QueueEntry"> | $Enums.TriageLevel
    state?: EnumQueueStateFilter<"QueueEntry"> | $Enums.QueueState
    checkedInAt?: DateTimeFilter<"QueueEntry"> | Date | string
    scheduledFor?: DateTimeFilter<"QueueEntry"> | Date | string
    channel?: EnumConsultChannelFilter<"QueueEntry"> | $Enums.ConsultChannel
    reason?: StringFilter<"QueueEntry"> | string
    connectionQuality?: StringFilter<"QueueEntry"> | string
    handoverId?: StringNullableFilter<"QueueEntry"> | string | null
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    doctor?: XOR<DoctorNullableScalarRelationFilter, DoctorWhereInput> | null
    handover?: XOR<AriaHandoverNullableScalarRelationFilter, AriaHandoverWhereInput> | null
  }

  export type QueueEntryOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrderInput | SortOrder
    kind?: SortOrder
    triage?: SortOrder
    state?: SortOrder
    checkedInAt?: SortOrder
    scheduledFor?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    connectionQuality?: SortOrder
    handoverId?: SortOrderInput | SortOrder
    patient?: PatientOrderByWithRelationInput
    doctor?: DoctorOrderByWithRelationInput
    handover?: AriaHandoverOrderByWithRelationInput
  }

  export type QueueEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    handoverId?: string
    AND?: QueueEntryWhereInput | QueueEntryWhereInput[]
    OR?: QueueEntryWhereInput[]
    NOT?: QueueEntryWhereInput | QueueEntryWhereInput[]
    patientId?: StringFilter<"QueueEntry"> | string
    doctorId?: StringNullableFilter<"QueueEntry"> | string | null
    kind?: EnumEncounterKindFilter<"QueueEntry"> | $Enums.EncounterKind
    triage?: EnumTriageLevelFilter<"QueueEntry"> | $Enums.TriageLevel
    state?: EnumQueueStateFilter<"QueueEntry"> | $Enums.QueueState
    checkedInAt?: DateTimeFilter<"QueueEntry"> | Date | string
    scheduledFor?: DateTimeFilter<"QueueEntry"> | Date | string
    channel?: EnumConsultChannelFilter<"QueueEntry"> | $Enums.ConsultChannel
    reason?: StringFilter<"QueueEntry"> | string
    connectionQuality?: StringFilter<"QueueEntry"> | string
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    doctor?: XOR<DoctorNullableScalarRelationFilter, DoctorWhereInput> | null
    handover?: XOR<AriaHandoverNullableScalarRelationFilter, AriaHandoverWhereInput> | null
  }, "id" | "handoverId">

  export type QueueEntryOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrderInput | SortOrder
    kind?: SortOrder
    triage?: SortOrder
    state?: SortOrder
    checkedInAt?: SortOrder
    scheduledFor?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    connectionQuality?: SortOrder
    handoverId?: SortOrderInput | SortOrder
    _count?: QueueEntryCountOrderByAggregateInput
    _max?: QueueEntryMaxOrderByAggregateInput
    _min?: QueueEntryMinOrderByAggregateInput
  }

  export type QueueEntryScalarWhereWithAggregatesInput = {
    AND?: QueueEntryScalarWhereWithAggregatesInput | QueueEntryScalarWhereWithAggregatesInput[]
    OR?: QueueEntryScalarWhereWithAggregatesInput[]
    NOT?: QueueEntryScalarWhereWithAggregatesInput | QueueEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QueueEntry"> | string
    patientId?: StringWithAggregatesFilter<"QueueEntry"> | string
    doctorId?: StringNullableWithAggregatesFilter<"QueueEntry"> | string | null
    kind?: EnumEncounterKindWithAggregatesFilter<"QueueEntry"> | $Enums.EncounterKind
    triage?: EnumTriageLevelWithAggregatesFilter<"QueueEntry"> | $Enums.TriageLevel
    state?: EnumQueueStateWithAggregatesFilter<"QueueEntry"> | $Enums.QueueState
    checkedInAt?: DateTimeWithAggregatesFilter<"QueueEntry"> | Date | string
    scheduledFor?: DateTimeWithAggregatesFilter<"QueueEntry"> | Date | string
    channel?: EnumConsultChannelWithAggregatesFilter<"QueueEntry"> | $Enums.ConsultChannel
    reason?: StringWithAggregatesFilter<"QueueEntry"> | string
    connectionQuality?: StringWithAggregatesFilter<"QueueEntry"> | string
    handoverId?: StringNullableWithAggregatesFilter<"QueueEntry"> | string | null
  }

  export type EncounterWhereInput = {
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    id?: StringFilter<"Encounter"> | string
    patientId?: StringFilter<"Encounter"> | string
    doctorId?: StringFilter<"Encounter"> | string
    startedAt?: DateTimeFilter<"Encounter"> | Date | string
    endedAt?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    channel?: EnumConsultChannelFilter<"Encounter"> | $Enums.ConsultChannel
    chiefComplaint?: StringFilter<"Encounter"> | string
    assessment?: StringFilter<"Encounter"> | string
    clinicalNotes?: StringFilter<"Encounter"> | string
    prescriptions?: JsonFilter<"Encounter">
    labRequests?: JsonFilter<"Encounter">
    followUp?: JsonNullableFilter<"Encounter">
    ariaAccepted?: BoolFilter<"Encounter"> | boolean
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    doctor?: XOR<DoctorScalarRelationFilter, DoctorWhereInput>
  }

  export type EncounterOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    channel?: SortOrder
    chiefComplaint?: SortOrder
    assessment?: SortOrder
    clinicalNotes?: SortOrder
    prescriptions?: SortOrder
    labRequests?: SortOrder
    followUp?: SortOrderInput | SortOrder
    ariaAccepted?: SortOrder
    patient?: PatientOrderByWithRelationInput
    doctor?: DoctorOrderByWithRelationInput
  }

  export type EncounterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    patientId?: StringFilter<"Encounter"> | string
    doctorId?: StringFilter<"Encounter"> | string
    startedAt?: DateTimeFilter<"Encounter"> | Date | string
    endedAt?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    channel?: EnumConsultChannelFilter<"Encounter"> | $Enums.ConsultChannel
    chiefComplaint?: StringFilter<"Encounter"> | string
    assessment?: StringFilter<"Encounter"> | string
    clinicalNotes?: StringFilter<"Encounter"> | string
    prescriptions?: JsonFilter<"Encounter">
    labRequests?: JsonFilter<"Encounter">
    followUp?: JsonNullableFilter<"Encounter">
    ariaAccepted?: BoolFilter<"Encounter"> | boolean
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    doctor?: XOR<DoctorScalarRelationFilter, DoctorWhereInput>
  }, "id">

  export type EncounterOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    channel?: SortOrder
    chiefComplaint?: SortOrder
    assessment?: SortOrder
    clinicalNotes?: SortOrder
    prescriptions?: SortOrder
    labRequests?: SortOrder
    followUp?: SortOrderInput | SortOrder
    ariaAccepted?: SortOrder
    _count?: EncounterCountOrderByAggregateInput
    _max?: EncounterMaxOrderByAggregateInput
    _min?: EncounterMinOrderByAggregateInput
  }

  export type EncounterScalarWhereWithAggregatesInput = {
    AND?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    OR?: EncounterScalarWhereWithAggregatesInput[]
    NOT?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Encounter"> | string
    patientId?: StringWithAggregatesFilter<"Encounter"> | string
    doctorId?: StringWithAggregatesFilter<"Encounter"> | string
    startedAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"Encounter"> | Date | string | null
    channel?: EnumConsultChannelWithAggregatesFilter<"Encounter"> | $Enums.ConsultChannel
    chiefComplaint?: StringWithAggregatesFilter<"Encounter"> | string
    assessment?: StringWithAggregatesFilter<"Encounter"> | string
    clinicalNotes?: StringWithAggregatesFilter<"Encounter"> | string
    prescriptions?: JsonWithAggregatesFilter<"Encounter">
    labRequests?: JsonWithAggregatesFilter<"Encounter">
    followUp?: JsonNullableWithAggregatesFilter<"Encounter">
    ariaAccepted?: BoolWithAggregatesFilter<"Encounter"> | boolean
  }

  export type ConsentGrantWhereInput = {
    AND?: ConsentGrantWhereInput | ConsentGrantWhereInput[]
    OR?: ConsentGrantWhereInput[]
    NOT?: ConsentGrantWhereInput | ConsentGrantWhereInput[]
    id?: StringFilter<"ConsentGrant"> | string
    patientId?: StringFilter<"ConsentGrant"> | string
    grantedTo?: StringFilter<"ConsentGrant"> | string
    purpose?: StringFilter<"ConsentGrant"> | string
    scope?: StringNullableListFilter<"ConsentGrant">
    grantedAt?: DateTimeFilter<"ConsentGrant"> | Date | string
    expiresAt?: DateTimeFilter<"ConsentGrant"> | Date | string
    active?: BoolFilter<"ConsentGrant"> | boolean
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    doctor?: XOR<DoctorScalarRelationFilter, DoctorWhereInput>
  }

  export type ConsentGrantOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    grantedTo?: SortOrder
    purpose?: SortOrder
    scope?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
    patient?: PatientOrderByWithRelationInput
    doctor?: DoctorOrderByWithRelationInput
  }

  export type ConsentGrantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConsentGrantWhereInput | ConsentGrantWhereInput[]
    OR?: ConsentGrantWhereInput[]
    NOT?: ConsentGrantWhereInput | ConsentGrantWhereInput[]
    patientId?: StringFilter<"ConsentGrant"> | string
    grantedTo?: StringFilter<"ConsentGrant"> | string
    purpose?: StringFilter<"ConsentGrant"> | string
    scope?: StringNullableListFilter<"ConsentGrant">
    grantedAt?: DateTimeFilter<"ConsentGrant"> | Date | string
    expiresAt?: DateTimeFilter<"ConsentGrant"> | Date | string
    active?: BoolFilter<"ConsentGrant"> | boolean
    patient?: XOR<PatientScalarRelationFilter, PatientWhereInput>
    doctor?: XOR<DoctorScalarRelationFilter, DoctorWhereInput>
  }, "id">

  export type ConsentGrantOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    grantedTo?: SortOrder
    purpose?: SortOrder
    scope?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
    _count?: ConsentGrantCountOrderByAggregateInput
    _max?: ConsentGrantMaxOrderByAggregateInput
    _min?: ConsentGrantMinOrderByAggregateInput
  }

  export type ConsentGrantScalarWhereWithAggregatesInput = {
    AND?: ConsentGrantScalarWhereWithAggregatesInput | ConsentGrantScalarWhereWithAggregatesInput[]
    OR?: ConsentGrantScalarWhereWithAggregatesInput[]
    NOT?: ConsentGrantScalarWhereWithAggregatesInput | ConsentGrantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConsentGrant"> | string
    patientId?: StringWithAggregatesFilter<"ConsentGrant"> | string
    grantedTo?: StringWithAggregatesFilter<"ConsentGrant"> | string
    purpose?: StringWithAggregatesFilter<"ConsentGrant"> | string
    scope?: StringNullableListFilter<"ConsentGrant">
    grantedAt?: DateTimeWithAggregatesFilter<"ConsentGrant"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"ConsentGrant"> | Date | string
    active?: BoolWithAggregatesFilter<"ConsentGrant"> | boolean
  }

  export type AuditEventWhereInput = {
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    actorName?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    target?: StringFilter<"AuditEvent"> | string
    reason?: StringNullableFilter<"AuditEvent"> | string | null
    at?: DateTimeFilter<"AuditEvent"> | Date | string
    doctor?: XOR<DoctorNullableScalarRelationFilter, DoctorWhereInput> | null
  }

  export type AuditEventOrderByWithRelationInput = {
    id?: SortOrder
    actorId?: SortOrderInput | SortOrder
    actorName?: SortOrder
    action?: SortOrder
    target?: SortOrder
    reason?: SortOrderInput | SortOrder
    at?: SortOrder
    doctor?: DoctorOrderByWithRelationInput
  }

  export type AuditEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    actorName?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    target?: StringFilter<"AuditEvent"> | string
    reason?: StringNullableFilter<"AuditEvent"> | string | null
    at?: DateTimeFilter<"AuditEvent"> | Date | string
    doctor?: XOR<DoctorNullableScalarRelationFilter, DoctorWhereInput> | null
  }, "id">

  export type AuditEventOrderByWithAggregationInput = {
    id?: SortOrder
    actorId?: SortOrderInput | SortOrder
    actorName?: SortOrder
    action?: SortOrder
    target?: SortOrder
    reason?: SortOrderInput | SortOrder
    at?: SortOrder
    _count?: AuditEventCountOrderByAggregateInput
    _max?: AuditEventMaxOrderByAggregateInput
    _min?: AuditEventMinOrderByAggregateInput
  }

  export type AuditEventScalarWhereWithAggregatesInput = {
    AND?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    OR?: AuditEventScalarWhereWithAggregatesInput[]
    NOT?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditEvent"> | string
    actorId?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    actorName?: StringWithAggregatesFilter<"AuditEvent"> | string
    action?: StringWithAggregatesFilter<"AuditEvent"> | string
    target?: StringWithAggregatesFilter<"AuditEvent"> | string
    reason?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    at?: DateTimeWithAggregatesFilter<"AuditEvent"> | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    phone: string
    authUserId?: string | null
    expoPushToken?: string | null
    createdAt?: Date | string
    patients?: PatientCreateNestedManyWithoutAccountInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    phone: string
    authUserId?: string | null
    expoPushToken?: string | null
    createdAt?: Date | string
    patients?: PatientUncheckedCreateNestedManyWithoutAccountInput
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    expoPushToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientUpdateManyWithoutAccountNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    expoPushToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patients?: PatientUncheckedUpdateManyWithoutAccountNestedInput
  }

  export type AccountCreateManyInput = {
    id?: string
    phone: string
    authUserId?: string | null
    expoPushToken?: string | null
    createdAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    expoPushToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    expoPushToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DoctorCreateInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryCreateNestedManyWithoutDoctorInput
    encounters?: EncounterCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantCreateNestedManyWithoutDoctorInput
    audits?: AuditEventCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUncheckedCreateInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryUncheckedCreateNestedManyWithoutDoctorInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutDoctorInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUpdateManyWithoutDoctorNestedInput
    encounters?: EncounterUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUncheckedUpdateManyWithoutDoctorNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorCreateManyInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
  }

  export type DoctorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DoctorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyCreateInput = {
    id?: string
    authUserId?: string | null
    name: string
    email: string
    licenseNo: string
    ownerName: string
    phone?: string | null
    city?: string | null
    district?: string | null
    state?: string | null
    country?: string | null
    services?: PharmacyCreateservicesInput | string[]
    avatarTone?: string | null
    onboardingComplete?: boolean
    verified?: boolean
    profile?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PharmacyUncheckedCreateInput = {
    id?: string
    authUserId?: string | null
    name: string
    email: string
    licenseNo: string
    ownerName: string
    phone?: string | null
    city?: string | null
    district?: string | null
    state?: string | null
    country?: string | null
    services?: PharmacyCreateservicesInput | string[]
    avatarTone?: string | null
    onboardingComplete?: boolean
    verified?: boolean
    profile?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PharmacyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    licenseNo?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    services?: PharmacyUpdateservicesInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    verified?: BoolFieldUpdateOperationsInput | boolean
    profile?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    licenseNo?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    services?: PharmacyUpdateservicesInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    verified?: BoolFieldUpdateOperationsInput | boolean
    profile?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyCreateManyInput = {
    id?: string
    authUserId?: string | null
    name: string
    email: string
    licenseNo: string
    ownerName: string
    phone?: string | null
    city?: string | null
    district?: string | null
    state?: string | null
    country?: string | null
    services?: PharmacyCreateservicesInput | string[]
    avatarTone?: string | null
    onboardingComplete?: boolean
    verified?: boolean
    profile?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type PharmacyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    licenseNo?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    services?: PharmacyUpdateservicesInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    verified?: BoolFieldUpdateOperationsInput | boolean
    profile?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PharmacyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    licenseNo?: StringFieldUpdateOperationsInput | string
    ownerName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    district?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    services?: PharmacyUpdateservicesInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    verified?: BoolFieldUpdateOperationsInput | boolean
    profile?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientCreateInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    account: AccountCreateNestedOneWithoutPatientsInput
    handovers?: AriaHandoverCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    accountId: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    handovers?: AriaHandoverUncheckedCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutPatientsNestedInput
    handovers?: AriaHandoverUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    handovers?: AriaHandoverUncheckedUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id?: string
    accountId: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AriaHandoverCreateInput = {
    id?: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
    patient: PatientCreateNestedOneWithoutHandoversInput
    queueEntry?: QueueEntryCreateNestedOneWithoutHandoverInput
  }

  export type AriaHandoverUncheckedCreateInput = {
    id?: string
    patientId: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
    queueEntry?: QueueEntryUncheckedCreateNestedOneWithoutHandoverInput
  }

  export type AriaHandoverUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
    patient?: PatientUpdateOneRequiredWithoutHandoversNestedInput
    queueEntry?: QueueEntryUpdateOneWithoutHandoverNestedInput
  }

  export type AriaHandoverUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
    queueEntry?: QueueEntryUncheckedUpdateOneWithoutHandoverNestedInput
  }

  export type AriaHandoverCreateManyInput = {
    id?: string
    patientId: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
  }

  export type AriaHandoverUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AriaHandoverUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
  }

  export type QueueEntryCreateInput = {
    id?: string
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    patient: PatientCreateNestedOneWithoutQueueEntriesInput
    doctor?: DoctorCreateNestedOneWithoutQueueInput
    handover?: AriaHandoverCreateNestedOneWithoutQueueEntryInput
  }

  export type QueueEntryUncheckedCreateInput = {
    id?: string
    patientId: string
    doctorId?: string | null
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    handoverId?: string | null
  }

  export type QueueEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutQueueEntriesNestedInput
    doctor?: DoctorUpdateOneWithoutQueueNestedInput
    handover?: AriaHandoverUpdateOneWithoutQueueEntryNestedInput
  }

  export type QueueEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    handoverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QueueEntryCreateManyInput = {
    id?: string
    patientId: string
    doctorId?: string | null
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    handoverId?: string | null
  }

  export type QueueEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
  }

  export type QueueEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    handoverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EncounterCreateInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
    patient: PatientCreateNestedOneWithoutEncountersInput
    doctor: DoctorCreateNestedOneWithoutEncountersInput
  }

  export type EncounterUncheckedCreateInput = {
    id?: string
    patientId: string
    doctorId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
  }

  export type EncounterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
    doctor?: DoctorUpdateOneRequiredWithoutEncountersNestedInput
  }

  export type EncounterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    doctorId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EncounterCreateManyInput = {
    id?: string
    patientId: string
    doctorId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
  }

  export type EncounterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EncounterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    doctorId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentGrantCreateInput = {
    id?: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
    patient: PatientCreateNestedOneWithoutConsentsInput
    doctor: DoctorCreateNestedOneWithoutConsentsInput
  }

  export type ConsentGrantUncheckedCreateInput = {
    id?: string
    patientId: string
    grantedTo: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
  }

  export type ConsentGrantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    patient?: PatientUpdateOneRequiredWithoutConsentsNestedInput
    doctor?: DoctorUpdateOneRequiredWithoutConsentsNestedInput
  }

  export type ConsentGrantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    grantedTo?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentGrantCreateManyInput = {
    id?: string
    patientId: string
    grantedTo: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
  }

  export type ConsentGrantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentGrantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    grantedTo?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AuditEventCreateInput = {
    id?: string
    actorName: string
    action: string
    target: string
    reason?: string | null
    at?: Date | string
    doctor?: DoctorCreateNestedOneWithoutAuditsInput
  }

  export type AuditEventUncheckedCreateInput = {
    id?: string
    actorId?: string | null
    actorName: string
    action: string
    target: string
    reason?: string | null
    at?: Date | string
  }

  export type AuditEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
    doctor?: DoctorUpdateOneWithoutAuditsNestedInput
  }

  export type AuditEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateManyInput = {
    id?: string
    actorId?: string | null
    actorName: string
    action: string
    target: string
    reason?: string | null
    at?: Date | string
  }

  export type AuditEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PatientListRelationFilter = {
    every?: PatientWhereInput
    some?: PatientWhereInput
    none?: PatientWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PatientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    authUserId?: SortOrder
    expoPushToken?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    authUserId?: SortOrder
    expoPushToken?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    authUserId?: SortOrder
    expoPushToken?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type QueueEntryListRelationFilter = {
    every?: QueueEntryWhereInput
    some?: QueueEntryWhereInput
    none?: QueueEntryWhereInput
  }

  export type EncounterListRelationFilter = {
    every?: EncounterWhereInput
    some?: EncounterWhereInput
    none?: EncounterWhereInput
  }

  export type ConsentGrantListRelationFilter = {
    every?: ConsentGrantWhereInput
    some?: ConsentGrantWhereInput
    none?: ConsentGrantWhereInput
  }

  export type AuditEventListRelationFilter = {
    every?: AuditEventWhereInput
    some?: AuditEventWhereInput
    none?: AuditEventWhereInput
  }

  export type QueueEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EncounterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConsentGrantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DoctorCountOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    specialty?: SortOrder
    registrationNo?: SortOrder
    languages?: SortOrder
    clinicName?: SortOrder
    mfaEnabled?: SortOrder
    avatarTone?: SortOrder
    onboardingComplete?: SortOrder
    country?: SortOrder
    profile?: SortOrder
    onCall?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
  }

  export type DoctorMaxOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    specialty?: SortOrder
    registrationNo?: SortOrder
    clinicName?: SortOrder
    mfaEnabled?: SortOrder
    avatarTone?: SortOrder
    onboardingComplete?: SortOrder
    country?: SortOrder
    onCall?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
  }

  export type DoctorMinOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    specialty?: SortOrder
    registrationNo?: SortOrder
    clinicName?: SortOrder
    mfaEnabled?: SortOrder
    avatarTone?: SortOrder
    onboardingComplete?: SortOrder
    country?: SortOrder
    onCall?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PharmacyCountOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    licenseNo?: SortOrder
    ownerName?: SortOrder
    phone?: SortOrder
    city?: SortOrder
    district?: SortOrder
    state?: SortOrder
    country?: SortOrder
    services?: SortOrder
    avatarTone?: SortOrder
    onboardingComplete?: SortOrder
    verified?: SortOrder
    profile?: SortOrder
    createdAt?: SortOrder
  }

  export type PharmacyMaxOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    licenseNo?: SortOrder
    ownerName?: SortOrder
    phone?: SortOrder
    city?: SortOrder
    district?: SortOrder
    state?: SortOrder
    country?: SortOrder
    avatarTone?: SortOrder
    onboardingComplete?: SortOrder
    verified?: SortOrder
    createdAt?: SortOrder
  }

  export type PharmacyMinOrderByAggregateInput = {
    id?: SortOrder
    authUserId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    licenseNo?: SortOrder
    ownerName?: SortOrder
    phone?: SortOrder
    city?: SortOrder
    district?: SortOrder
    state?: SortOrder
    country?: SortOrder
    avatarTone?: SortOrder
    onboardingComplete?: SortOrder
    verified?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumSexFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    not?: NestedEnumSexFilter<$PrismaModel> | $Enums.Sex
  }

  export type EnumRelationshipRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipRole | EnumRelationshipRoleFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipRoleFilter<$PrismaModel> | $Enums.RelationshipRole
  }

  export type AccountScalarRelationFilter = {
    is?: AccountWhereInput
    isNot?: AccountWhereInput
  }

  export type AriaHandoverListRelationFilter = {
    every?: AriaHandoverWhereInput
    some?: AriaHandoverWhereInput
    none?: AriaHandoverWhereInput
  }

  export type AriaHandoverOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    phoneMasked?: SortOrder
    village?: SortOrder
    district?: SortOrder
    preferredLanguage?: SortOrder
    abhaLinked?: SortOrder
    relationshipToAccount?: SortOrder
    allergies?: SortOrder
    conditions?: SortOrder
    currentMedications?: SortOrder
    avatarTone?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    phoneMasked?: SortOrder
    village?: SortOrder
    district?: SortOrder
    preferredLanguage?: SortOrder
    abhaLinked?: SortOrder
    relationshipToAccount?: SortOrder
    avatarTone?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    fullName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    phoneMasked?: SortOrder
    village?: SortOrder
    district?: SortOrder
    preferredLanguage?: SortOrder
    abhaLinked?: SortOrder
    relationshipToAccount?: SortOrder
    avatarTone?: SortOrder
  }

  export type EnumSexWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    not?: NestedEnumSexWithAggregatesFilter<$PrismaModel> | $Enums.Sex
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSexFilter<$PrismaModel>
    _max?: NestedEnumSexFilter<$PrismaModel>
  }

  export type EnumRelationshipRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipRole | EnumRelationshipRoleFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipRoleWithAggregatesFilter<$PrismaModel> | $Enums.RelationshipRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRelationshipRoleFilter<$PrismaModel>
    _max?: NestedEnumRelationshipRoleFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumTriageLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.TriageLevel | EnumTriageLevelFieldRefInput<$PrismaModel>
    in?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumTriageLevelFilter<$PrismaModel> | $Enums.TriageLevel
  }

  export type PatientScalarRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type QueueEntryNullableScalarRelationFilter = {
    is?: QueueEntryWhereInput | null
    isNot?: QueueEntryWhereInput | null
  }

  export type AriaHandoverCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    createdAt?: SortOrder
    chiefComplaint?: SortOrder
    narrative?: SortOrder
    durationText?: SortOrder
    symptoms?: SortOrder
    redFlags?: SortOrder
    vitals?: SortOrder
    aiConfidence?: SortOrder
    suggestedTriage?: SortOrder
    language?: SortOrder
    verifiedByDoctor?: SortOrder
  }

  export type AriaHandoverAvgOrderByAggregateInput = {
    aiConfidence?: SortOrder
  }

  export type AriaHandoverMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    createdAt?: SortOrder
    chiefComplaint?: SortOrder
    narrative?: SortOrder
    durationText?: SortOrder
    aiConfidence?: SortOrder
    suggestedTriage?: SortOrder
    language?: SortOrder
    verifiedByDoctor?: SortOrder
  }

  export type AriaHandoverMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    createdAt?: SortOrder
    chiefComplaint?: SortOrder
    narrative?: SortOrder
    durationText?: SortOrder
    aiConfidence?: SortOrder
    suggestedTriage?: SortOrder
    language?: SortOrder
    verifiedByDoctor?: SortOrder
  }

  export type AriaHandoverSumOrderByAggregateInput = {
    aiConfidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumTriageLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TriageLevel | EnumTriageLevelFieldRefInput<$PrismaModel>
    in?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumTriageLevelWithAggregatesFilter<$PrismaModel> | $Enums.TriageLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTriageLevelFilter<$PrismaModel>
    _max?: NestedEnumTriageLevelFilter<$PrismaModel>
  }

  export type EnumEncounterKindFilter<$PrismaModel = never> = {
    equals?: $Enums.EncounterKind | EnumEncounterKindFieldRefInput<$PrismaModel>
    in?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    not?: NestedEnumEncounterKindFilter<$PrismaModel> | $Enums.EncounterKind
  }

  export type EnumQueueStateFilter<$PrismaModel = never> = {
    equals?: $Enums.QueueState | EnumQueueStateFieldRefInput<$PrismaModel>
    in?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    not?: NestedEnumQueueStateFilter<$PrismaModel> | $Enums.QueueState
  }

  export type EnumConsultChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsultChannel | EnumConsultChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConsultChannelFilter<$PrismaModel> | $Enums.ConsultChannel
  }

  export type DoctorNullableScalarRelationFilter = {
    is?: DoctorWhereInput | null
    isNot?: DoctorWhereInput | null
  }

  export type AriaHandoverNullableScalarRelationFilter = {
    is?: AriaHandoverWhereInput | null
    isNot?: AriaHandoverWhereInput | null
  }

  export type QueueEntryCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    kind?: SortOrder
    triage?: SortOrder
    state?: SortOrder
    checkedInAt?: SortOrder
    scheduledFor?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    connectionQuality?: SortOrder
    handoverId?: SortOrder
  }

  export type QueueEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    kind?: SortOrder
    triage?: SortOrder
    state?: SortOrder
    checkedInAt?: SortOrder
    scheduledFor?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    connectionQuality?: SortOrder
    handoverId?: SortOrder
  }

  export type QueueEntryMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    kind?: SortOrder
    triage?: SortOrder
    state?: SortOrder
    checkedInAt?: SortOrder
    scheduledFor?: SortOrder
    channel?: SortOrder
    reason?: SortOrder
    connectionQuality?: SortOrder
    handoverId?: SortOrder
  }

  export type EnumEncounterKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EncounterKind | EnumEncounterKindFieldRefInput<$PrismaModel>
    in?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    not?: NestedEnumEncounterKindWithAggregatesFilter<$PrismaModel> | $Enums.EncounterKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEncounterKindFilter<$PrismaModel>
    _max?: NestedEnumEncounterKindFilter<$PrismaModel>
  }

  export type EnumQueueStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QueueState | EnumQueueStateFieldRefInput<$PrismaModel>
    in?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    not?: NestedEnumQueueStateWithAggregatesFilter<$PrismaModel> | $Enums.QueueState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQueueStateFilter<$PrismaModel>
    _max?: NestedEnumQueueStateFilter<$PrismaModel>
  }

  export type EnumConsultChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsultChannel | EnumConsultChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConsultChannelWithAggregatesFilter<$PrismaModel> | $Enums.ConsultChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConsultChannelFilter<$PrismaModel>
    _max?: NestedEnumConsultChannelFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DoctorScalarRelationFilter = {
    is?: DoctorWhereInput
    isNot?: DoctorWhereInput
  }

  export type EncounterCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    channel?: SortOrder
    chiefComplaint?: SortOrder
    assessment?: SortOrder
    clinicalNotes?: SortOrder
    prescriptions?: SortOrder
    labRequests?: SortOrder
    followUp?: SortOrder
    ariaAccepted?: SortOrder
  }

  export type EncounterMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    channel?: SortOrder
    chiefComplaint?: SortOrder
    assessment?: SortOrder
    clinicalNotes?: SortOrder
    ariaAccepted?: SortOrder
  }

  export type EncounterMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    doctorId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    channel?: SortOrder
    chiefComplaint?: SortOrder
    assessment?: SortOrder
    clinicalNotes?: SortOrder
    ariaAccepted?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ConsentGrantCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    grantedTo?: SortOrder
    purpose?: SortOrder
    scope?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
  }

  export type ConsentGrantMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    grantedTo?: SortOrder
    purpose?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
  }

  export type ConsentGrantMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    grantedTo?: SortOrder
    purpose?: SortOrder
    grantedAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
  }

  export type AuditEventCountOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    actorName?: SortOrder
    action?: SortOrder
    target?: SortOrder
    reason?: SortOrder
    at?: SortOrder
  }

  export type AuditEventMaxOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    actorName?: SortOrder
    action?: SortOrder
    target?: SortOrder
    reason?: SortOrder
    at?: SortOrder
  }

  export type AuditEventMinOrderByAggregateInput = {
    id?: SortOrder
    actorId?: SortOrder
    actorName?: SortOrder
    action?: SortOrder
    target?: SortOrder
    reason?: SortOrder
    at?: SortOrder
  }

  export type PatientCreateNestedManyWithoutAccountInput = {
    create?: XOR<PatientCreateWithoutAccountInput, PatientUncheckedCreateWithoutAccountInput> | PatientCreateWithoutAccountInput[] | PatientUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutAccountInput | PatientCreateOrConnectWithoutAccountInput[]
    createMany?: PatientCreateManyAccountInputEnvelope
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
  }

  export type PatientUncheckedCreateNestedManyWithoutAccountInput = {
    create?: XOR<PatientCreateWithoutAccountInput, PatientUncheckedCreateWithoutAccountInput> | PatientCreateWithoutAccountInput[] | PatientUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutAccountInput | PatientCreateOrConnectWithoutAccountInput[]
    createMany?: PatientCreateManyAccountInputEnvelope
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PatientUpdateManyWithoutAccountNestedInput = {
    create?: XOR<PatientCreateWithoutAccountInput, PatientUncheckedCreateWithoutAccountInput> | PatientCreateWithoutAccountInput[] | PatientUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutAccountInput | PatientCreateOrConnectWithoutAccountInput[]
    upsert?: PatientUpsertWithWhereUniqueWithoutAccountInput | PatientUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: PatientCreateManyAccountInputEnvelope
    set?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    disconnect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    delete?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    update?: PatientUpdateWithWhereUniqueWithoutAccountInput | PatientUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: PatientUpdateManyWithWhereWithoutAccountInput | PatientUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: PatientScalarWhereInput | PatientScalarWhereInput[]
  }

  export type PatientUncheckedUpdateManyWithoutAccountNestedInput = {
    create?: XOR<PatientCreateWithoutAccountInput, PatientUncheckedCreateWithoutAccountInput> | PatientCreateWithoutAccountInput[] | PatientUncheckedCreateWithoutAccountInput[]
    connectOrCreate?: PatientCreateOrConnectWithoutAccountInput | PatientCreateOrConnectWithoutAccountInput[]
    upsert?: PatientUpsertWithWhereUniqueWithoutAccountInput | PatientUpsertWithWhereUniqueWithoutAccountInput[]
    createMany?: PatientCreateManyAccountInputEnvelope
    set?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    disconnect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    delete?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    connect?: PatientWhereUniqueInput | PatientWhereUniqueInput[]
    update?: PatientUpdateWithWhereUniqueWithoutAccountInput | PatientUpdateWithWhereUniqueWithoutAccountInput[]
    updateMany?: PatientUpdateManyWithWhereWithoutAccountInput | PatientUpdateManyWithWhereWithoutAccountInput[]
    deleteMany?: PatientScalarWhereInput | PatientScalarWhereInput[]
  }

  export type DoctorCreatelanguagesInput = {
    set: string[]
  }

  export type QueueEntryCreateNestedManyWithoutDoctorInput = {
    create?: XOR<QueueEntryCreateWithoutDoctorInput, QueueEntryUncheckedCreateWithoutDoctorInput> | QueueEntryCreateWithoutDoctorInput[] | QueueEntryUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutDoctorInput | QueueEntryCreateOrConnectWithoutDoctorInput[]
    createMany?: QueueEntryCreateManyDoctorInputEnvelope
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
  }

  export type EncounterCreateNestedManyWithoutDoctorInput = {
    create?: XOR<EncounterCreateWithoutDoctorInput, EncounterUncheckedCreateWithoutDoctorInput> | EncounterCreateWithoutDoctorInput[] | EncounterUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutDoctorInput | EncounterCreateOrConnectWithoutDoctorInput[]
    createMany?: EncounterCreateManyDoctorInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type ConsentGrantCreateNestedManyWithoutDoctorInput = {
    create?: XOR<ConsentGrantCreateWithoutDoctorInput, ConsentGrantUncheckedCreateWithoutDoctorInput> | ConsentGrantCreateWithoutDoctorInput[] | ConsentGrantUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutDoctorInput | ConsentGrantCreateOrConnectWithoutDoctorInput[]
    createMany?: ConsentGrantCreateManyDoctorInputEnvelope
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
  }

  export type AuditEventCreateNestedManyWithoutDoctorInput = {
    create?: XOR<AuditEventCreateWithoutDoctorInput, AuditEventUncheckedCreateWithoutDoctorInput> | AuditEventCreateWithoutDoctorInput[] | AuditEventUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutDoctorInput | AuditEventCreateOrConnectWithoutDoctorInput[]
    createMany?: AuditEventCreateManyDoctorInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type QueueEntryUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: XOR<QueueEntryCreateWithoutDoctorInput, QueueEntryUncheckedCreateWithoutDoctorInput> | QueueEntryCreateWithoutDoctorInput[] | QueueEntryUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutDoctorInput | QueueEntryCreateOrConnectWithoutDoctorInput[]
    createMany?: QueueEntryCreateManyDoctorInputEnvelope
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: XOR<EncounterCreateWithoutDoctorInput, EncounterUncheckedCreateWithoutDoctorInput> | EncounterCreateWithoutDoctorInput[] | EncounterUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutDoctorInput | EncounterCreateOrConnectWithoutDoctorInput[]
    createMany?: EncounterCreateManyDoctorInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type ConsentGrantUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: XOR<ConsentGrantCreateWithoutDoctorInput, ConsentGrantUncheckedCreateWithoutDoctorInput> | ConsentGrantCreateWithoutDoctorInput[] | ConsentGrantUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutDoctorInput | ConsentGrantCreateOrConnectWithoutDoctorInput[]
    createMany?: ConsentGrantCreateManyDoctorInputEnvelope
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
  }

  export type AuditEventUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: XOR<AuditEventCreateWithoutDoctorInput, AuditEventUncheckedCreateWithoutDoctorInput> | AuditEventCreateWithoutDoctorInput[] | AuditEventUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutDoctorInput | AuditEventCreateOrConnectWithoutDoctorInput[]
    createMany?: AuditEventCreateManyDoctorInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type DoctorUpdatelanguagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type QueueEntryUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<QueueEntryCreateWithoutDoctorInput, QueueEntryUncheckedCreateWithoutDoctorInput> | QueueEntryCreateWithoutDoctorInput[] | QueueEntryUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutDoctorInput | QueueEntryCreateOrConnectWithoutDoctorInput[]
    upsert?: QueueEntryUpsertWithWhereUniqueWithoutDoctorInput | QueueEntryUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: QueueEntryCreateManyDoctorInputEnvelope
    set?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    disconnect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    delete?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    update?: QueueEntryUpdateWithWhereUniqueWithoutDoctorInput | QueueEntryUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: QueueEntryUpdateManyWithWhereWithoutDoctorInput | QueueEntryUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: QueueEntryScalarWhereInput | QueueEntryScalarWhereInput[]
  }

  export type EncounterUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<EncounterCreateWithoutDoctorInput, EncounterUncheckedCreateWithoutDoctorInput> | EncounterCreateWithoutDoctorInput[] | EncounterUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutDoctorInput | EncounterCreateOrConnectWithoutDoctorInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutDoctorInput | EncounterUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: EncounterCreateManyDoctorInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutDoctorInput | EncounterUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutDoctorInput | EncounterUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type ConsentGrantUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<ConsentGrantCreateWithoutDoctorInput, ConsentGrantUncheckedCreateWithoutDoctorInput> | ConsentGrantCreateWithoutDoctorInput[] | ConsentGrantUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutDoctorInput | ConsentGrantCreateOrConnectWithoutDoctorInput[]
    upsert?: ConsentGrantUpsertWithWhereUniqueWithoutDoctorInput | ConsentGrantUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: ConsentGrantCreateManyDoctorInputEnvelope
    set?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    disconnect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    delete?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    update?: ConsentGrantUpdateWithWhereUniqueWithoutDoctorInput | ConsentGrantUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: ConsentGrantUpdateManyWithWhereWithoutDoctorInput | ConsentGrantUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: ConsentGrantScalarWhereInput | ConsentGrantScalarWhereInput[]
  }

  export type AuditEventUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<AuditEventCreateWithoutDoctorInput, AuditEventUncheckedCreateWithoutDoctorInput> | AuditEventCreateWithoutDoctorInput[] | AuditEventUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutDoctorInput | AuditEventCreateOrConnectWithoutDoctorInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutDoctorInput | AuditEventUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: AuditEventCreateManyDoctorInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutDoctorInput | AuditEventUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutDoctorInput | AuditEventUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type QueueEntryUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<QueueEntryCreateWithoutDoctorInput, QueueEntryUncheckedCreateWithoutDoctorInput> | QueueEntryCreateWithoutDoctorInput[] | QueueEntryUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutDoctorInput | QueueEntryCreateOrConnectWithoutDoctorInput[]
    upsert?: QueueEntryUpsertWithWhereUniqueWithoutDoctorInput | QueueEntryUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: QueueEntryCreateManyDoctorInputEnvelope
    set?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    disconnect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    delete?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    update?: QueueEntryUpdateWithWhereUniqueWithoutDoctorInput | QueueEntryUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: QueueEntryUpdateManyWithWhereWithoutDoctorInput | QueueEntryUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: QueueEntryScalarWhereInput | QueueEntryScalarWhereInput[]
  }

  export type EncounterUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<EncounterCreateWithoutDoctorInput, EncounterUncheckedCreateWithoutDoctorInput> | EncounterCreateWithoutDoctorInput[] | EncounterUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutDoctorInput | EncounterCreateOrConnectWithoutDoctorInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutDoctorInput | EncounterUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: EncounterCreateManyDoctorInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutDoctorInput | EncounterUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutDoctorInput | EncounterUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type ConsentGrantUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<ConsentGrantCreateWithoutDoctorInput, ConsentGrantUncheckedCreateWithoutDoctorInput> | ConsentGrantCreateWithoutDoctorInput[] | ConsentGrantUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutDoctorInput | ConsentGrantCreateOrConnectWithoutDoctorInput[]
    upsert?: ConsentGrantUpsertWithWhereUniqueWithoutDoctorInput | ConsentGrantUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: ConsentGrantCreateManyDoctorInputEnvelope
    set?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    disconnect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    delete?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    update?: ConsentGrantUpdateWithWhereUniqueWithoutDoctorInput | ConsentGrantUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: ConsentGrantUpdateManyWithWhereWithoutDoctorInput | ConsentGrantUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: ConsentGrantScalarWhereInput | ConsentGrantScalarWhereInput[]
  }

  export type AuditEventUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<AuditEventCreateWithoutDoctorInput, AuditEventUncheckedCreateWithoutDoctorInput> | AuditEventCreateWithoutDoctorInput[] | AuditEventUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutDoctorInput | AuditEventCreateOrConnectWithoutDoctorInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutDoctorInput | AuditEventUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: AuditEventCreateManyDoctorInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutDoctorInput | AuditEventUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutDoctorInput | AuditEventUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type PharmacyCreateservicesInput = {
    set: string[]
  }

  export type PharmacyUpdateservicesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PatientCreateallergiesInput = {
    set: string[]
  }

  export type PatientCreateconditionsInput = {
    set: string[]
  }

  export type PatientCreatecurrentMedicationsInput = {
    set: string[]
  }

  export type AccountCreateNestedOneWithoutPatientsInput = {
    create?: XOR<AccountCreateWithoutPatientsInput, AccountUncheckedCreateWithoutPatientsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutPatientsInput
    connect?: AccountWhereUniqueInput
  }

  export type AriaHandoverCreateNestedManyWithoutPatientInput = {
    create?: XOR<AriaHandoverCreateWithoutPatientInput, AriaHandoverUncheckedCreateWithoutPatientInput> | AriaHandoverCreateWithoutPatientInput[] | AriaHandoverUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AriaHandoverCreateOrConnectWithoutPatientInput | AriaHandoverCreateOrConnectWithoutPatientInput[]
    createMany?: AriaHandoverCreateManyPatientInputEnvelope
    connect?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
  }

  export type QueueEntryCreateNestedManyWithoutPatientInput = {
    create?: XOR<QueueEntryCreateWithoutPatientInput, QueueEntryUncheckedCreateWithoutPatientInput> | QueueEntryCreateWithoutPatientInput[] | QueueEntryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutPatientInput | QueueEntryCreateOrConnectWithoutPatientInput[]
    createMany?: QueueEntryCreateManyPatientInputEnvelope
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
  }

  export type EncounterCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type ConsentGrantCreateNestedManyWithoutPatientInput = {
    create?: XOR<ConsentGrantCreateWithoutPatientInput, ConsentGrantUncheckedCreateWithoutPatientInput> | ConsentGrantCreateWithoutPatientInput[] | ConsentGrantUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutPatientInput | ConsentGrantCreateOrConnectWithoutPatientInput[]
    createMany?: ConsentGrantCreateManyPatientInputEnvelope
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
  }

  export type AriaHandoverUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AriaHandoverCreateWithoutPatientInput, AriaHandoverUncheckedCreateWithoutPatientInput> | AriaHandoverCreateWithoutPatientInput[] | AriaHandoverUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AriaHandoverCreateOrConnectWithoutPatientInput | AriaHandoverCreateOrConnectWithoutPatientInput[]
    createMany?: AriaHandoverCreateManyPatientInputEnvelope
    connect?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
  }

  export type QueueEntryUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<QueueEntryCreateWithoutPatientInput, QueueEntryUncheckedCreateWithoutPatientInput> | QueueEntryCreateWithoutPatientInput[] | QueueEntryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutPatientInput | QueueEntryCreateOrConnectWithoutPatientInput[]
    createMany?: QueueEntryCreateManyPatientInputEnvelope
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type ConsentGrantUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<ConsentGrantCreateWithoutPatientInput, ConsentGrantUncheckedCreateWithoutPatientInput> | ConsentGrantCreateWithoutPatientInput[] | ConsentGrantUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutPatientInput | ConsentGrantCreateOrConnectWithoutPatientInput[]
    createMany?: ConsentGrantCreateManyPatientInputEnvelope
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
  }

  export type EnumSexFieldUpdateOperationsInput = {
    set?: $Enums.Sex
  }

  export type EnumRelationshipRoleFieldUpdateOperationsInput = {
    set?: $Enums.RelationshipRole
  }

  export type PatientUpdateallergiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PatientUpdateconditionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PatientUpdatecurrentMedicationsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AccountUpdateOneRequiredWithoutPatientsNestedInput = {
    create?: XOR<AccountCreateWithoutPatientsInput, AccountUncheckedCreateWithoutPatientsInput>
    connectOrCreate?: AccountCreateOrConnectWithoutPatientsInput
    upsert?: AccountUpsertWithoutPatientsInput
    connect?: AccountWhereUniqueInput
    update?: XOR<XOR<AccountUpdateToOneWithWhereWithoutPatientsInput, AccountUpdateWithoutPatientsInput>, AccountUncheckedUpdateWithoutPatientsInput>
  }

  export type AriaHandoverUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AriaHandoverCreateWithoutPatientInput, AriaHandoverUncheckedCreateWithoutPatientInput> | AriaHandoverCreateWithoutPatientInput[] | AriaHandoverUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AriaHandoverCreateOrConnectWithoutPatientInput | AriaHandoverCreateOrConnectWithoutPatientInput[]
    upsert?: AriaHandoverUpsertWithWhereUniqueWithoutPatientInput | AriaHandoverUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AriaHandoverCreateManyPatientInputEnvelope
    set?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    disconnect?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    delete?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    connect?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    update?: AriaHandoverUpdateWithWhereUniqueWithoutPatientInput | AriaHandoverUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AriaHandoverUpdateManyWithWhereWithoutPatientInput | AriaHandoverUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AriaHandoverScalarWhereInput | AriaHandoverScalarWhereInput[]
  }

  export type QueueEntryUpdateManyWithoutPatientNestedInput = {
    create?: XOR<QueueEntryCreateWithoutPatientInput, QueueEntryUncheckedCreateWithoutPatientInput> | QueueEntryCreateWithoutPatientInput[] | QueueEntryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutPatientInput | QueueEntryCreateOrConnectWithoutPatientInput[]
    upsert?: QueueEntryUpsertWithWhereUniqueWithoutPatientInput | QueueEntryUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: QueueEntryCreateManyPatientInputEnvelope
    set?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    disconnect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    delete?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    update?: QueueEntryUpdateWithWhereUniqueWithoutPatientInput | QueueEntryUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: QueueEntryUpdateManyWithWhereWithoutPatientInput | QueueEntryUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: QueueEntryScalarWhereInput | QueueEntryScalarWhereInput[]
  }

  export type EncounterUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type ConsentGrantUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ConsentGrantCreateWithoutPatientInput, ConsentGrantUncheckedCreateWithoutPatientInput> | ConsentGrantCreateWithoutPatientInput[] | ConsentGrantUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutPatientInput | ConsentGrantCreateOrConnectWithoutPatientInput[]
    upsert?: ConsentGrantUpsertWithWhereUniqueWithoutPatientInput | ConsentGrantUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ConsentGrantCreateManyPatientInputEnvelope
    set?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    disconnect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    delete?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    update?: ConsentGrantUpdateWithWhereUniqueWithoutPatientInput | ConsentGrantUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ConsentGrantUpdateManyWithWhereWithoutPatientInput | ConsentGrantUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ConsentGrantScalarWhereInput | ConsentGrantScalarWhereInput[]
  }

  export type AriaHandoverUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AriaHandoverCreateWithoutPatientInput, AriaHandoverUncheckedCreateWithoutPatientInput> | AriaHandoverCreateWithoutPatientInput[] | AriaHandoverUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AriaHandoverCreateOrConnectWithoutPatientInput | AriaHandoverCreateOrConnectWithoutPatientInput[]
    upsert?: AriaHandoverUpsertWithWhereUniqueWithoutPatientInput | AriaHandoverUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AriaHandoverCreateManyPatientInputEnvelope
    set?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    disconnect?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    delete?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    connect?: AriaHandoverWhereUniqueInput | AriaHandoverWhereUniqueInput[]
    update?: AriaHandoverUpdateWithWhereUniqueWithoutPatientInput | AriaHandoverUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AriaHandoverUpdateManyWithWhereWithoutPatientInput | AriaHandoverUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AriaHandoverScalarWhereInput | AriaHandoverScalarWhereInput[]
  }

  export type QueueEntryUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<QueueEntryCreateWithoutPatientInput, QueueEntryUncheckedCreateWithoutPatientInput> | QueueEntryCreateWithoutPatientInput[] | QueueEntryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: QueueEntryCreateOrConnectWithoutPatientInput | QueueEntryCreateOrConnectWithoutPatientInput[]
    upsert?: QueueEntryUpsertWithWhereUniqueWithoutPatientInput | QueueEntryUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: QueueEntryCreateManyPatientInputEnvelope
    set?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    disconnect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    delete?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    connect?: QueueEntryWhereUniqueInput | QueueEntryWhereUniqueInput[]
    update?: QueueEntryUpdateWithWhereUniqueWithoutPatientInput | QueueEntryUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: QueueEntryUpdateManyWithWhereWithoutPatientInput | QueueEntryUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: QueueEntryScalarWhereInput | QueueEntryScalarWhereInput[]
  }

  export type EncounterUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type ConsentGrantUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<ConsentGrantCreateWithoutPatientInput, ConsentGrantUncheckedCreateWithoutPatientInput> | ConsentGrantCreateWithoutPatientInput[] | ConsentGrantUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: ConsentGrantCreateOrConnectWithoutPatientInput | ConsentGrantCreateOrConnectWithoutPatientInput[]
    upsert?: ConsentGrantUpsertWithWhereUniqueWithoutPatientInput | ConsentGrantUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: ConsentGrantCreateManyPatientInputEnvelope
    set?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    disconnect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    delete?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    connect?: ConsentGrantWhereUniqueInput | ConsentGrantWhereUniqueInput[]
    update?: ConsentGrantUpdateWithWhereUniqueWithoutPatientInput | ConsentGrantUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: ConsentGrantUpdateManyWithWhereWithoutPatientInput | ConsentGrantUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: ConsentGrantScalarWhereInput | ConsentGrantScalarWhereInput[]
  }

  export type AriaHandoverCreatesymptomsInput = {
    set: string[]
  }

  export type AriaHandoverCreateredFlagsInput = {
    set: string[]
  }

  export type PatientCreateNestedOneWithoutHandoversInput = {
    create?: XOR<PatientCreateWithoutHandoversInput, PatientUncheckedCreateWithoutHandoversInput>
    connectOrCreate?: PatientCreateOrConnectWithoutHandoversInput
    connect?: PatientWhereUniqueInput
  }

  export type QueueEntryCreateNestedOneWithoutHandoverInput = {
    create?: XOR<QueueEntryCreateWithoutHandoverInput, QueueEntryUncheckedCreateWithoutHandoverInput>
    connectOrCreate?: QueueEntryCreateOrConnectWithoutHandoverInput
    connect?: QueueEntryWhereUniqueInput
  }

  export type QueueEntryUncheckedCreateNestedOneWithoutHandoverInput = {
    create?: XOR<QueueEntryCreateWithoutHandoverInput, QueueEntryUncheckedCreateWithoutHandoverInput>
    connectOrCreate?: QueueEntryCreateOrConnectWithoutHandoverInput
    connect?: QueueEntryWhereUniqueInput
  }

  export type AriaHandoverUpdatesymptomsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type AriaHandoverUpdateredFlagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumTriageLevelFieldUpdateOperationsInput = {
    set?: $Enums.TriageLevel
  }

  export type PatientUpdateOneRequiredWithoutHandoversNestedInput = {
    create?: XOR<PatientCreateWithoutHandoversInput, PatientUncheckedCreateWithoutHandoversInput>
    connectOrCreate?: PatientCreateOrConnectWithoutHandoversInput
    upsert?: PatientUpsertWithoutHandoversInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutHandoversInput, PatientUpdateWithoutHandoversInput>, PatientUncheckedUpdateWithoutHandoversInput>
  }

  export type QueueEntryUpdateOneWithoutHandoverNestedInput = {
    create?: XOR<QueueEntryCreateWithoutHandoverInput, QueueEntryUncheckedCreateWithoutHandoverInput>
    connectOrCreate?: QueueEntryCreateOrConnectWithoutHandoverInput
    upsert?: QueueEntryUpsertWithoutHandoverInput
    disconnect?: QueueEntryWhereInput | boolean
    delete?: QueueEntryWhereInput | boolean
    connect?: QueueEntryWhereUniqueInput
    update?: XOR<XOR<QueueEntryUpdateToOneWithWhereWithoutHandoverInput, QueueEntryUpdateWithoutHandoverInput>, QueueEntryUncheckedUpdateWithoutHandoverInput>
  }

  export type QueueEntryUncheckedUpdateOneWithoutHandoverNestedInput = {
    create?: XOR<QueueEntryCreateWithoutHandoverInput, QueueEntryUncheckedCreateWithoutHandoverInput>
    connectOrCreate?: QueueEntryCreateOrConnectWithoutHandoverInput
    upsert?: QueueEntryUpsertWithoutHandoverInput
    disconnect?: QueueEntryWhereInput | boolean
    delete?: QueueEntryWhereInput | boolean
    connect?: QueueEntryWhereUniqueInput
    update?: XOR<XOR<QueueEntryUpdateToOneWithWhereWithoutHandoverInput, QueueEntryUpdateWithoutHandoverInput>, QueueEntryUncheckedUpdateWithoutHandoverInput>
  }

  export type PatientCreateNestedOneWithoutQueueEntriesInput = {
    create?: XOR<PatientCreateWithoutQueueEntriesInput, PatientUncheckedCreateWithoutQueueEntriesInput>
    connectOrCreate?: PatientCreateOrConnectWithoutQueueEntriesInput
    connect?: PatientWhereUniqueInput
  }

  export type DoctorCreateNestedOneWithoutQueueInput = {
    create?: XOR<DoctorCreateWithoutQueueInput, DoctorUncheckedCreateWithoutQueueInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutQueueInput
    connect?: DoctorWhereUniqueInput
  }

  export type AriaHandoverCreateNestedOneWithoutQueueEntryInput = {
    create?: XOR<AriaHandoverCreateWithoutQueueEntryInput, AriaHandoverUncheckedCreateWithoutQueueEntryInput>
    connectOrCreate?: AriaHandoverCreateOrConnectWithoutQueueEntryInput
    connect?: AriaHandoverWhereUniqueInput
  }

  export type EnumEncounterKindFieldUpdateOperationsInput = {
    set?: $Enums.EncounterKind
  }

  export type EnumQueueStateFieldUpdateOperationsInput = {
    set?: $Enums.QueueState
  }

  export type EnumConsultChannelFieldUpdateOperationsInput = {
    set?: $Enums.ConsultChannel
  }

  export type PatientUpdateOneRequiredWithoutQueueEntriesNestedInput = {
    create?: XOR<PatientCreateWithoutQueueEntriesInput, PatientUncheckedCreateWithoutQueueEntriesInput>
    connectOrCreate?: PatientCreateOrConnectWithoutQueueEntriesInput
    upsert?: PatientUpsertWithoutQueueEntriesInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutQueueEntriesInput, PatientUpdateWithoutQueueEntriesInput>, PatientUncheckedUpdateWithoutQueueEntriesInput>
  }

  export type DoctorUpdateOneWithoutQueueNestedInput = {
    create?: XOR<DoctorCreateWithoutQueueInput, DoctorUncheckedCreateWithoutQueueInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutQueueInput
    upsert?: DoctorUpsertWithoutQueueInput
    disconnect?: DoctorWhereInput | boolean
    delete?: DoctorWhereInput | boolean
    connect?: DoctorWhereUniqueInput
    update?: XOR<XOR<DoctorUpdateToOneWithWhereWithoutQueueInput, DoctorUpdateWithoutQueueInput>, DoctorUncheckedUpdateWithoutQueueInput>
  }

  export type AriaHandoverUpdateOneWithoutQueueEntryNestedInput = {
    create?: XOR<AriaHandoverCreateWithoutQueueEntryInput, AriaHandoverUncheckedCreateWithoutQueueEntryInput>
    connectOrCreate?: AriaHandoverCreateOrConnectWithoutQueueEntryInput
    upsert?: AriaHandoverUpsertWithoutQueueEntryInput
    disconnect?: AriaHandoverWhereInput | boolean
    delete?: AriaHandoverWhereInput | boolean
    connect?: AriaHandoverWhereUniqueInput
    update?: XOR<XOR<AriaHandoverUpdateToOneWithWhereWithoutQueueEntryInput, AriaHandoverUpdateWithoutQueueEntryInput>, AriaHandoverUncheckedUpdateWithoutQueueEntryInput>
  }

  export type PatientCreateNestedOneWithoutEncountersInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    connect?: PatientWhereUniqueInput
  }

  export type DoctorCreateNestedOneWithoutEncountersInput = {
    create?: XOR<DoctorCreateWithoutEncountersInput, DoctorUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutEncountersInput
    connect?: DoctorWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutEncountersNestedInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    upsert?: PatientUpsertWithoutEncountersInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutEncountersInput, PatientUpdateWithoutEncountersInput>, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type DoctorUpdateOneRequiredWithoutEncountersNestedInput = {
    create?: XOR<DoctorCreateWithoutEncountersInput, DoctorUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutEncountersInput
    upsert?: DoctorUpsertWithoutEncountersInput
    connect?: DoctorWhereUniqueInput
    update?: XOR<XOR<DoctorUpdateToOneWithWhereWithoutEncountersInput, DoctorUpdateWithoutEncountersInput>, DoctorUncheckedUpdateWithoutEncountersInput>
  }

  export type ConsentGrantCreatescopeInput = {
    set: string[]
  }

  export type PatientCreateNestedOneWithoutConsentsInput = {
    create?: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutConsentsInput
    connect?: PatientWhereUniqueInput
  }

  export type DoctorCreateNestedOneWithoutConsentsInput = {
    create?: XOR<DoctorCreateWithoutConsentsInput, DoctorUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutConsentsInput
    connect?: DoctorWhereUniqueInput
  }

  export type ConsentGrantUpdatescopeInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PatientUpdateOneRequiredWithoutConsentsNestedInput = {
    create?: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutConsentsInput
    upsert?: PatientUpsertWithoutConsentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutConsentsInput, PatientUpdateWithoutConsentsInput>, PatientUncheckedUpdateWithoutConsentsInput>
  }

  export type DoctorUpdateOneRequiredWithoutConsentsNestedInput = {
    create?: XOR<DoctorCreateWithoutConsentsInput, DoctorUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutConsentsInput
    upsert?: DoctorUpsertWithoutConsentsInput
    connect?: DoctorWhereUniqueInput
    update?: XOR<XOR<DoctorUpdateToOneWithWhereWithoutConsentsInput, DoctorUpdateWithoutConsentsInput>, DoctorUncheckedUpdateWithoutConsentsInput>
  }

  export type DoctorCreateNestedOneWithoutAuditsInput = {
    create?: XOR<DoctorCreateWithoutAuditsInput, DoctorUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutAuditsInput
    connect?: DoctorWhereUniqueInput
  }

  export type DoctorUpdateOneWithoutAuditsNestedInput = {
    create?: XOR<DoctorCreateWithoutAuditsInput, DoctorUncheckedCreateWithoutAuditsInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutAuditsInput
    upsert?: DoctorUpsertWithoutAuditsInput
    disconnect?: DoctorWhereInput | boolean
    delete?: DoctorWhereInput | boolean
    connect?: DoctorWhereUniqueInput
    update?: XOR<XOR<DoctorUpdateToOneWithWhereWithoutAuditsInput, DoctorUpdateWithoutAuditsInput>, DoctorUncheckedUpdateWithoutAuditsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSexFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    not?: NestedEnumSexFilter<$PrismaModel> | $Enums.Sex
  }

  export type NestedEnumRelationshipRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipRole | EnumRelationshipRoleFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipRoleFilter<$PrismaModel> | $Enums.RelationshipRole
  }

  export type NestedEnumSexWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Sex | EnumSexFieldRefInput<$PrismaModel>
    in?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    notIn?: $Enums.Sex[] | ListEnumSexFieldRefInput<$PrismaModel>
    not?: NestedEnumSexWithAggregatesFilter<$PrismaModel> | $Enums.Sex
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSexFilter<$PrismaModel>
    _max?: NestedEnumSexFilter<$PrismaModel>
  }

  export type NestedEnumRelationshipRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RelationshipRole | EnumRelationshipRoleFieldRefInput<$PrismaModel>
    in?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.RelationshipRole[] | ListEnumRelationshipRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRelationshipRoleWithAggregatesFilter<$PrismaModel> | $Enums.RelationshipRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRelationshipRoleFilter<$PrismaModel>
    _max?: NestedEnumRelationshipRoleFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumTriageLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.TriageLevel | EnumTriageLevelFieldRefInput<$PrismaModel>
    in?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumTriageLevelFilter<$PrismaModel> | $Enums.TriageLevel
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumTriageLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TriageLevel | EnumTriageLevelFieldRefInput<$PrismaModel>
    in?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.TriageLevel[] | ListEnumTriageLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumTriageLevelWithAggregatesFilter<$PrismaModel> | $Enums.TriageLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTriageLevelFilter<$PrismaModel>
    _max?: NestedEnumTriageLevelFilter<$PrismaModel>
  }

  export type NestedEnumEncounterKindFilter<$PrismaModel = never> = {
    equals?: $Enums.EncounterKind | EnumEncounterKindFieldRefInput<$PrismaModel>
    in?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    not?: NestedEnumEncounterKindFilter<$PrismaModel> | $Enums.EncounterKind
  }

  export type NestedEnumQueueStateFilter<$PrismaModel = never> = {
    equals?: $Enums.QueueState | EnumQueueStateFieldRefInput<$PrismaModel>
    in?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    not?: NestedEnumQueueStateFilter<$PrismaModel> | $Enums.QueueState
  }

  export type NestedEnumConsultChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsultChannel | EnumConsultChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConsultChannelFilter<$PrismaModel> | $Enums.ConsultChannel
  }

  export type NestedEnumEncounterKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EncounterKind | EnumEncounterKindFieldRefInput<$PrismaModel>
    in?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    notIn?: $Enums.EncounterKind[] | ListEnumEncounterKindFieldRefInput<$PrismaModel>
    not?: NestedEnumEncounterKindWithAggregatesFilter<$PrismaModel> | $Enums.EncounterKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEncounterKindFilter<$PrismaModel>
    _max?: NestedEnumEncounterKindFilter<$PrismaModel>
  }

  export type NestedEnumQueueStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QueueState | EnumQueueStateFieldRefInput<$PrismaModel>
    in?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    notIn?: $Enums.QueueState[] | ListEnumQueueStateFieldRefInput<$PrismaModel>
    not?: NestedEnumQueueStateWithAggregatesFilter<$PrismaModel> | $Enums.QueueState
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQueueStateFilter<$PrismaModel>
    _max?: NestedEnumQueueStateFilter<$PrismaModel>
  }

  export type NestedEnumConsultChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsultChannel | EnumConsultChannelFieldRefInput<$PrismaModel>
    in?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.ConsultChannel[] | ListEnumConsultChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumConsultChannelWithAggregatesFilter<$PrismaModel> | $Enums.ConsultChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumConsultChannelFilter<$PrismaModel>
    _max?: NestedEnumConsultChannelFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PatientCreateWithoutAccountInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    handovers?: AriaHandoverCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutAccountInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    handovers?: AriaHandoverUncheckedCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutAccountInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAccountInput, PatientUncheckedCreateWithoutAccountInput>
  }

  export type PatientCreateManyAccountInputEnvelope = {
    data: PatientCreateManyAccountInput | PatientCreateManyAccountInput[]
    skipDuplicates?: boolean
  }

  export type PatientUpsertWithWhereUniqueWithoutAccountInput = {
    where: PatientWhereUniqueInput
    update: XOR<PatientUpdateWithoutAccountInput, PatientUncheckedUpdateWithoutAccountInput>
    create: XOR<PatientCreateWithoutAccountInput, PatientUncheckedCreateWithoutAccountInput>
  }

  export type PatientUpdateWithWhereUniqueWithoutAccountInput = {
    where: PatientWhereUniqueInput
    data: XOR<PatientUpdateWithoutAccountInput, PatientUncheckedUpdateWithoutAccountInput>
  }

  export type PatientUpdateManyWithWhereWithoutAccountInput = {
    where: PatientScalarWhereInput
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyWithoutAccountInput>
  }

  export type PatientScalarWhereInput = {
    AND?: PatientScalarWhereInput | PatientScalarWhereInput[]
    OR?: PatientScalarWhereInput[]
    NOT?: PatientScalarWhereInput | PatientScalarWhereInput[]
    id?: StringFilter<"Patient"> | string
    accountId?: StringFilter<"Patient"> | string
    fullName?: StringFilter<"Patient"> | string
    sex?: EnumSexFilter<"Patient"> | $Enums.Sex
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    phoneMasked?: StringFilter<"Patient"> | string
    village?: StringFilter<"Patient"> | string
    district?: StringFilter<"Patient"> | string
    preferredLanguage?: StringFilter<"Patient"> | string
    abhaLinked?: BoolFilter<"Patient"> | boolean
    relationshipToAccount?: EnumRelationshipRoleFilter<"Patient"> | $Enums.RelationshipRole
    allergies?: StringNullableListFilter<"Patient">
    conditions?: StringNullableListFilter<"Patient">
    currentMedications?: StringNullableListFilter<"Patient">
    avatarTone?: StringNullableFilter<"Patient"> | string | null
  }

  export type QueueEntryCreateWithoutDoctorInput = {
    id?: string
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    patient: PatientCreateNestedOneWithoutQueueEntriesInput
    handover?: AriaHandoverCreateNestedOneWithoutQueueEntryInput
  }

  export type QueueEntryUncheckedCreateWithoutDoctorInput = {
    id?: string
    patientId: string
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    handoverId?: string | null
  }

  export type QueueEntryCreateOrConnectWithoutDoctorInput = {
    where: QueueEntryWhereUniqueInput
    create: XOR<QueueEntryCreateWithoutDoctorInput, QueueEntryUncheckedCreateWithoutDoctorInput>
  }

  export type QueueEntryCreateManyDoctorInputEnvelope = {
    data: QueueEntryCreateManyDoctorInput | QueueEntryCreateManyDoctorInput[]
    skipDuplicates?: boolean
  }

  export type EncounterCreateWithoutDoctorInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
    patient: PatientCreateNestedOneWithoutEncountersInput
  }

  export type EncounterUncheckedCreateWithoutDoctorInput = {
    id?: string
    patientId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
  }

  export type EncounterCreateOrConnectWithoutDoctorInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutDoctorInput, EncounterUncheckedCreateWithoutDoctorInput>
  }

  export type EncounterCreateManyDoctorInputEnvelope = {
    data: EncounterCreateManyDoctorInput | EncounterCreateManyDoctorInput[]
    skipDuplicates?: boolean
  }

  export type ConsentGrantCreateWithoutDoctorInput = {
    id?: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
    patient: PatientCreateNestedOneWithoutConsentsInput
  }

  export type ConsentGrantUncheckedCreateWithoutDoctorInput = {
    id?: string
    patientId: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
  }

  export type ConsentGrantCreateOrConnectWithoutDoctorInput = {
    where: ConsentGrantWhereUniqueInput
    create: XOR<ConsentGrantCreateWithoutDoctorInput, ConsentGrantUncheckedCreateWithoutDoctorInput>
  }

  export type ConsentGrantCreateManyDoctorInputEnvelope = {
    data: ConsentGrantCreateManyDoctorInput | ConsentGrantCreateManyDoctorInput[]
    skipDuplicates?: boolean
  }

  export type AuditEventCreateWithoutDoctorInput = {
    id?: string
    actorName: string
    action: string
    target: string
    reason?: string | null
    at?: Date | string
  }

  export type AuditEventUncheckedCreateWithoutDoctorInput = {
    id?: string
    actorName: string
    action: string
    target: string
    reason?: string | null
    at?: Date | string
  }

  export type AuditEventCreateOrConnectWithoutDoctorInput = {
    where: AuditEventWhereUniqueInput
    create: XOR<AuditEventCreateWithoutDoctorInput, AuditEventUncheckedCreateWithoutDoctorInput>
  }

  export type AuditEventCreateManyDoctorInputEnvelope = {
    data: AuditEventCreateManyDoctorInput | AuditEventCreateManyDoctorInput[]
    skipDuplicates?: boolean
  }

  export type QueueEntryUpsertWithWhereUniqueWithoutDoctorInput = {
    where: QueueEntryWhereUniqueInput
    update: XOR<QueueEntryUpdateWithoutDoctorInput, QueueEntryUncheckedUpdateWithoutDoctorInput>
    create: XOR<QueueEntryCreateWithoutDoctorInput, QueueEntryUncheckedCreateWithoutDoctorInput>
  }

  export type QueueEntryUpdateWithWhereUniqueWithoutDoctorInput = {
    where: QueueEntryWhereUniqueInput
    data: XOR<QueueEntryUpdateWithoutDoctorInput, QueueEntryUncheckedUpdateWithoutDoctorInput>
  }

  export type QueueEntryUpdateManyWithWhereWithoutDoctorInput = {
    where: QueueEntryScalarWhereInput
    data: XOR<QueueEntryUpdateManyMutationInput, QueueEntryUncheckedUpdateManyWithoutDoctorInput>
  }

  export type QueueEntryScalarWhereInput = {
    AND?: QueueEntryScalarWhereInput | QueueEntryScalarWhereInput[]
    OR?: QueueEntryScalarWhereInput[]
    NOT?: QueueEntryScalarWhereInput | QueueEntryScalarWhereInput[]
    id?: StringFilter<"QueueEntry"> | string
    patientId?: StringFilter<"QueueEntry"> | string
    doctorId?: StringNullableFilter<"QueueEntry"> | string | null
    kind?: EnumEncounterKindFilter<"QueueEntry"> | $Enums.EncounterKind
    triage?: EnumTriageLevelFilter<"QueueEntry"> | $Enums.TriageLevel
    state?: EnumQueueStateFilter<"QueueEntry"> | $Enums.QueueState
    checkedInAt?: DateTimeFilter<"QueueEntry"> | Date | string
    scheduledFor?: DateTimeFilter<"QueueEntry"> | Date | string
    channel?: EnumConsultChannelFilter<"QueueEntry"> | $Enums.ConsultChannel
    reason?: StringFilter<"QueueEntry"> | string
    connectionQuality?: StringFilter<"QueueEntry"> | string
    handoverId?: StringNullableFilter<"QueueEntry"> | string | null
  }

  export type EncounterUpsertWithWhereUniqueWithoutDoctorInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutDoctorInput, EncounterUncheckedUpdateWithoutDoctorInput>
    create: XOR<EncounterCreateWithoutDoctorInput, EncounterUncheckedCreateWithoutDoctorInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutDoctorInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutDoctorInput, EncounterUncheckedUpdateWithoutDoctorInput>
  }

  export type EncounterUpdateManyWithWhereWithoutDoctorInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutDoctorInput>
  }

  export type EncounterScalarWhereInput = {
    AND?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    OR?: EncounterScalarWhereInput[]
    NOT?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    id?: StringFilter<"Encounter"> | string
    patientId?: StringFilter<"Encounter"> | string
    doctorId?: StringFilter<"Encounter"> | string
    startedAt?: DateTimeFilter<"Encounter"> | Date | string
    endedAt?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    channel?: EnumConsultChannelFilter<"Encounter"> | $Enums.ConsultChannel
    chiefComplaint?: StringFilter<"Encounter"> | string
    assessment?: StringFilter<"Encounter"> | string
    clinicalNotes?: StringFilter<"Encounter"> | string
    prescriptions?: JsonFilter<"Encounter">
    labRequests?: JsonFilter<"Encounter">
    followUp?: JsonNullableFilter<"Encounter">
    ariaAccepted?: BoolFilter<"Encounter"> | boolean
  }

  export type ConsentGrantUpsertWithWhereUniqueWithoutDoctorInput = {
    where: ConsentGrantWhereUniqueInput
    update: XOR<ConsentGrantUpdateWithoutDoctorInput, ConsentGrantUncheckedUpdateWithoutDoctorInput>
    create: XOR<ConsentGrantCreateWithoutDoctorInput, ConsentGrantUncheckedCreateWithoutDoctorInput>
  }

  export type ConsentGrantUpdateWithWhereUniqueWithoutDoctorInput = {
    where: ConsentGrantWhereUniqueInput
    data: XOR<ConsentGrantUpdateWithoutDoctorInput, ConsentGrantUncheckedUpdateWithoutDoctorInput>
  }

  export type ConsentGrantUpdateManyWithWhereWithoutDoctorInput = {
    where: ConsentGrantScalarWhereInput
    data: XOR<ConsentGrantUpdateManyMutationInput, ConsentGrantUncheckedUpdateManyWithoutDoctorInput>
  }

  export type ConsentGrantScalarWhereInput = {
    AND?: ConsentGrantScalarWhereInput | ConsentGrantScalarWhereInput[]
    OR?: ConsentGrantScalarWhereInput[]
    NOT?: ConsentGrantScalarWhereInput | ConsentGrantScalarWhereInput[]
    id?: StringFilter<"ConsentGrant"> | string
    patientId?: StringFilter<"ConsentGrant"> | string
    grantedTo?: StringFilter<"ConsentGrant"> | string
    purpose?: StringFilter<"ConsentGrant"> | string
    scope?: StringNullableListFilter<"ConsentGrant">
    grantedAt?: DateTimeFilter<"ConsentGrant"> | Date | string
    expiresAt?: DateTimeFilter<"ConsentGrant"> | Date | string
    active?: BoolFilter<"ConsentGrant"> | boolean
  }

  export type AuditEventUpsertWithWhereUniqueWithoutDoctorInput = {
    where: AuditEventWhereUniqueInput
    update: XOR<AuditEventUpdateWithoutDoctorInput, AuditEventUncheckedUpdateWithoutDoctorInput>
    create: XOR<AuditEventCreateWithoutDoctorInput, AuditEventUncheckedCreateWithoutDoctorInput>
  }

  export type AuditEventUpdateWithWhereUniqueWithoutDoctorInput = {
    where: AuditEventWhereUniqueInput
    data: XOR<AuditEventUpdateWithoutDoctorInput, AuditEventUncheckedUpdateWithoutDoctorInput>
  }

  export type AuditEventUpdateManyWithWhereWithoutDoctorInput = {
    where: AuditEventScalarWhereInput
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyWithoutDoctorInput>
  }

  export type AuditEventScalarWhereInput = {
    AND?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
    OR?: AuditEventScalarWhereInput[]
    NOT?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    actorId?: StringNullableFilter<"AuditEvent"> | string | null
    actorName?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    target?: StringFilter<"AuditEvent"> | string
    reason?: StringNullableFilter<"AuditEvent"> | string | null
    at?: DateTimeFilter<"AuditEvent"> | Date | string
  }

  export type AccountCreateWithoutPatientsInput = {
    id?: string
    phone: string
    authUserId?: string | null
    expoPushToken?: string | null
    createdAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutPatientsInput = {
    id?: string
    phone: string
    authUserId?: string | null
    expoPushToken?: string | null
    createdAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutPatientsInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutPatientsInput, AccountUncheckedCreateWithoutPatientsInput>
  }

  export type AriaHandoverCreateWithoutPatientInput = {
    id?: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
    queueEntry?: QueueEntryCreateNestedOneWithoutHandoverInput
  }

  export type AriaHandoverUncheckedCreateWithoutPatientInput = {
    id?: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
    queueEntry?: QueueEntryUncheckedCreateNestedOneWithoutHandoverInput
  }

  export type AriaHandoverCreateOrConnectWithoutPatientInput = {
    where: AriaHandoverWhereUniqueInput
    create: XOR<AriaHandoverCreateWithoutPatientInput, AriaHandoverUncheckedCreateWithoutPatientInput>
  }

  export type AriaHandoverCreateManyPatientInputEnvelope = {
    data: AriaHandoverCreateManyPatientInput | AriaHandoverCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type QueueEntryCreateWithoutPatientInput = {
    id?: string
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    doctor?: DoctorCreateNestedOneWithoutQueueInput
    handover?: AriaHandoverCreateNestedOneWithoutQueueEntryInput
  }

  export type QueueEntryUncheckedCreateWithoutPatientInput = {
    id?: string
    doctorId?: string | null
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    handoverId?: string | null
  }

  export type QueueEntryCreateOrConnectWithoutPatientInput = {
    where: QueueEntryWhereUniqueInput
    create: XOR<QueueEntryCreateWithoutPatientInput, QueueEntryUncheckedCreateWithoutPatientInput>
  }

  export type QueueEntryCreateManyPatientInputEnvelope = {
    data: QueueEntryCreateManyPatientInput | QueueEntryCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type EncounterCreateWithoutPatientInput = {
    id?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
    doctor: DoctorCreateNestedOneWithoutEncountersInput
  }

  export type EncounterUncheckedCreateWithoutPatientInput = {
    id?: string
    doctorId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
  }

  export type EncounterCreateOrConnectWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterCreateManyPatientInputEnvelope = {
    data: EncounterCreateManyPatientInput | EncounterCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type ConsentGrantCreateWithoutPatientInput = {
    id?: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
    doctor: DoctorCreateNestedOneWithoutConsentsInput
  }

  export type ConsentGrantUncheckedCreateWithoutPatientInput = {
    id?: string
    grantedTo: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
  }

  export type ConsentGrantCreateOrConnectWithoutPatientInput = {
    where: ConsentGrantWhereUniqueInput
    create: XOR<ConsentGrantCreateWithoutPatientInput, ConsentGrantUncheckedCreateWithoutPatientInput>
  }

  export type ConsentGrantCreateManyPatientInputEnvelope = {
    data: ConsentGrantCreateManyPatientInput | ConsentGrantCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithoutPatientsInput = {
    update: XOR<AccountUpdateWithoutPatientsInput, AccountUncheckedUpdateWithoutPatientsInput>
    create: XOR<AccountCreateWithoutPatientsInput, AccountUncheckedCreateWithoutPatientsInput>
    where?: AccountWhereInput
  }

  export type AccountUpdateToOneWithWhereWithoutPatientsInput = {
    where?: AccountWhereInput
    data: XOR<AccountUpdateWithoutPatientsInput, AccountUncheckedUpdateWithoutPatientsInput>
  }

  export type AccountUpdateWithoutPatientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    expoPushToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutPatientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    expoPushToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AriaHandoverUpsertWithWhereUniqueWithoutPatientInput = {
    where: AriaHandoverWhereUniqueInput
    update: XOR<AriaHandoverUpdateWithoutPatientInput, AriaHandoverUncheckedUpdateWithoutPatientInput>
    create: XOR<AriaHandoverCreateWithoutPatientInput, AriaHandoverUncheckedCreateWithoutPatientInput>
  }

  export type AriaHandoverUpdateWithWhereUniqueWithoutPatientInput = {
    where: AriaHandoverWhereUniqueInput
    data: XOR<AriaHandoverUpdateWithoutPatientInput, AriaHandoverUncheckedUpdateWithoutPatientInput>
  }

  export type AriaHandoverUpdateManyWithWhereWithoutPatientInput = {
    where: AriaHandoverScalarWhereInput
    data: XOR<AriaHandoverUpdateManyMutationInput, AriaHandoverUncheckedUpdateManyWithoutPatientInput>
  }

  export type AriaHandoverScalarWhereInput = {
    AND?: AriaHandoverScalarWhereInput | AriaHandoverScalarWhereInput[]
    OR?: AriaHandoverScalarWhereInput[]
    NOT?: AriaHandoverScalarWhereInput | AriaHandoverScalarWhereInput[]
    id?: StringFilter<"AriaHandover"> | string
    patientId?: StringFilter<"AriaHandover"> | string
    createdAt?: DateTimeFilter<"AriaHandover"> | Date | string
    chiefComplaint?: StringFilter<"AriaHandover"> | string
    narrative?: StringFilter<"AriaHandover"> | string
    durationText?: StringFilter<"AriaHandover"> | string
    symptoms?: StringNullableListFilter<"AriaHandover">
    redFlags?: StringNullableListFilter<"AriaHandover">
    vitals?: JsonNullableFilter<"AriaHandover">
    aiConfidence?: FloatFilter<"AriaHandover"> | number
    suggestedTriage?: EnumTriageLevelFilter<"AriaHandover"> | $Enums.TriageLevel
    language?: StringFilter<"AriaHandover"> | string
    verifiedByDoctor?: BoolFilter<"AriaHandover"> | boolean
  }

  export type QueueEntryUpsertWithWhereUniqueWithoutPatientInput = {
    where: QueueEntryWhereUniqueInput
    update: XOR<QueueEntryUpdateWithoutPatientInput, QueueEntryUncheckedUpdateWithoutPatientInput>
    create: XOR<QueueEntryCreateWithoutPatientInput, QueueEntryUncheckedCreateWithoutPatientInput>
  }

  export type QueueEntryUpdateWithWhereUniqueWithoutPatientInput = {
    where: QueueEntryWhereUniqueInput
    data: XOR<QueueEntryUpdateWithoutPatientInput, QueueEntryUncheckedUpdateWithoutPatientInput>
  }

  export type QueueEntryUpdateManyWithWhereWithoutPatientInput = {
    where: QueueEntryScalarWhereInput
    data: XOR<QueueEntryUpdateManyMutationInput, QueueEntryUncheckedUpdateManyWithoutPatientInput>
  }

  export type EncounterUpsertWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
  }

  export type EncounterUpdateManyWithWhereWithoutPatientInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutPatientInput>
  }

  export type ConsentGrantUpsertWithWhereUniqueWithoutPatientInput = {
    where: ConsentGrantWhereUniqueInput
    update: XOR<ConsentGrantUpdateWithoutPatientInput, ConsentGrantUncheckedUpdateWithoutPatientInput>
    create: XOR<ConsentGrantCreateWithoutPatientInput, ConsentGrantUncheckedCreateWithoutPatientInput>
  }

  export type ConsentGrantUpdateWithWhereUniqueWithoutPatientInput = {
    where: ConsentGrantWhereUniqueInput
    data: XOR<ConsentGrantUpdateWithoutPatientInput, ConsentGrantUncheckedUpdateWithoutPatientInput>
  }

  export type ConsentGrantUpdateManyWithWhereWithoutPatientInput = {
    where: ConsentGrantScalarWhereInput
    data: XOR<ConsentGrantUpdateManyMutationInput, ConsentGrantUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientCreateWithoutHandoversInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    account: AccountCreateNestedOneWithoutPatientsInput
    queueEntries?: QueueEntryCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutHandoversInput = {
    id?: string
    accountId: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    queueEntries?: QueueEntryUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutHandoversInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutHandoversInput, PatientUncheckedCreateWithoutHandoversInput>
  }

  export type QueueEntryCreateWithoutHandoverInput = {
    id?: string
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    patient: PatientCreateNestedOneWithoutQueueEntriesInput
    doctor?: DoctorCreateNestedOneWithoutQueueInput
  }

  export type QueueEntryUncheckedCreateWithoutHandoverInput = {
    id?: string
    patientId: string
    doctorId?: string | null
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
  }

  export type QueueEntryCreateOrConnectWithoutHandoverInput = {
    where: QueueEntryWhereUniqueInput
    create: XOR<QueueEntryCreateWithoutHandoverInput, QueueEntryUncheckedCreateWithoutHandoverInput>
  }

  export type PatientUpsertWithoutHandoversInput = {
    update: XOR<PatientUpdateWithoutHandoversInput, PatientUncheckedUpdateWithoutHandoversInput>
    create: XOR<PatientCreateWithoutHandoversInput, PatientUncheckedCreateWithoutHandoversInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutHandoversInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutHandoversInput, PatientUncheckedUpdateWithoutHandoversInput>
  }

  export type PatientUpdateWithoutHandoversInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutPatientsNestedInput
    queueEntries?: QueueEntryUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutHandoversInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    queueEntries?: QueueEntryUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type QueueEntryUpsertWithoutHandoverInput = {
    update: XOR<QueueEntryUpdateWithoutHandoverInput, QueueEntryUncheckedUpdateWithoutHandoverInput>
    create: XOR<QueueEntryCreateWithoutHandoverInput, QueueEntryUncheckedCreateWithoutHandoverInput>
    where?: QueueEntryWhereInput
  }

  export type QueueEntryUpdateToOneWithWhereWithoutHandoverInput = {
    where?: QueueEntryWhereInput
    data: XOR<QueueEntryUpdateWithoutHandoverInput, QueueEntryUncheckedUpdateWithoutHandoverInput>
  }

  export type QueueEntryUpdateWithoutHandoverInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutQueueEntriesNestedInput
    doctor?: DoctorUpdateOneWithoutQueueNestedInput
  }

  export type QueueEntryUncheckedUpdateWithoutHandoverInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
  }

  export type PatientCreateWithoutQueueEntriesInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    account: AccountCreateNestedOneWithoutPatientsInput
    handovers?: AriaHandoverCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutQueueEntriesInput = {
    id?: string
    accountId: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    handovers?: AriaHandoverUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutQueueEntriesInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutQueueEntriesInput, PatientUncheckedCreateWithoutQueueEntriesInput>
  }

  export type DoctorCreateWithoutQueueInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    encounters?: EncounterCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantCreateNestedManyWithoutDoctorInput
    audits?: AuditEventCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUncheckedCreateWithoutQueueInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    encounters?: EncounterUncheckedCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutDoctorInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutDoctorInput
  }

  export type DoctorCreateOrConnectWithoutQueueInput = {
    where: DoctorWhereUniqueInput
    create: XOR<DoctorCreateWithoutQueueInput, DoctorUncheckedCreateWithoutQueueInput>
  }

  export type AriaHandoverCreateWithoutQueueEntryInput = {
    id?: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
    patient: PatientCreateNestedOneWithoutHandoversInput
  }

  export type AriaHandoverUncheckedCreateWithoutQueueEntryInput = {
    id?: string
    patientId: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
  }

  export type AriaHandoverCreateOrConnectWithoutQueueEntryInput = {
    where: AriaHandoverWhereUniqueInput
    create: XOR<AriaHandoverCreateWithoutQueueEntryInput, AriaHandoverUncheckedCreateWithoutQueueEntryInput>
  }

  export type PatientUpsertWithoutQueueEntriesInput = {
    update: XOR<PatientUpdateWithoutQueueEntriesInput, PatientUncheckedUpdateWithoutQueueEntriesInput>
    create: XOR<PatientCreateWithoutQueueEntriesInput, PatientUncheckedCreateWithoutQueueEntriesInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutQueueEntriesInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutQueueEntriesInput, PatientUncheckedUpdateWithoutQueueEntriesInput>
  }

  export type PatientUpdateWithoutQueueEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutPatientsNestedInput
    handovers?: AriaHandoverUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutQueueEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    handovers?: AriaHandoverUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type DoctorUpsertWithoutQueueInput = {
    update: XOR<DoctorUpdateWithoutQueueInput, DoctorUncheckedUpdateWithoutQueueInput>
    create: XOR<DoctorCreateWithoutQueueInput, DoctorUncheckedCreateWithoutQueueInput>
    where?: DoctorWhereInput
  }

  export type DoctorUpdateToOneWithWhereWithoutQueueInput = {
    where?: DoctorWhereInput
    data: XOR<DoctorUpdateWithoutQueueInput, DoctorUncheckedUpdateWithoutQueueInput>
  }

  export type DoctorUpdateWithoutQueueInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorUncheckedUpdateWithoutQueueInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUncheckedUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutDoctorNestedInput
  }

  export type AriaHandoverUpsertWithoutQueueEntryInput = {
    update: XOR<AriaHandoverUpdateWithoutQueueEntryInput, AriaHandoverUncheckedUpdateWithoutQueueEntryInput>
    create: XOR<AriaHandoverCreateWithoutQueueEntryInput, AriaHandoverUncheckedCreateWithoutQueueEntryInput>
    where?: AriaHandoverWhereInput
  }

  export type AriaHandoverUpdateToOneWithWhereWithoutQueueEntryInput = {
    where?: AriaHandoverWhereInput
    data: XOR<AriaHandoverUpdateWithoutQueueEntryInput, AriaHandoverUncheckedUpdateWithoutQueueEntryInput>
  }

  export type AriaHandoverUpdateWithoutQueueEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
    patient?: PatientUpdateOneRequiredWithoutHandoversNestedInput
  }

  export type AriaHandoverUncheckedUpdateWithoutQueueEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PatientCreateWithoutEncountersInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    account: AccountCreateNestedOneWithoutPatientsInput
    handovers?: AriaHandoverCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutEncountersInput = {
    id?: string
    accountId: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    handovers?: AriaHandoverUncheckedCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryUncheckedCreateNestedManyWithoutPatientInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutEncountersInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
  }

  export type DoctorCreateWithoutEncountersInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantCreateNestedManyWithoutDoctorInput
    audits?: AuditEventCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUncheckedCreateWithoutEncountersInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryUncheckedCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutDoctorInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutDoctorInput
  }

  export type DoctorCreateOrConnectWithoutEncountersInput = {
    where: DoctorWhereUniqueInput
    create: XOR<DoctorCreateWithoutEncountersInput, DoctorUncheckedCreateWithoutEncountersInput>
  }

  export type PatientUpsertWithoutEncountersInput = {
    update: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutEncountersInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type PatientUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutPatientsNestedInput
    handovers?: AriaHandoverUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    handovers?: AriaHandoverUncheckedUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUncheckedUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type DoctorUpsertWithoutEncountersInput = {
    update: XOR<DoctorUpdateWithoutEncountersInput, DoctorUncheckedUpdateWithoutEncountersInput>
    create: XOR<DoctorCreateWithoutEncountersInput, DoctorUncheckedCreateWithoutEncountersInput>
    where?: DoctorWhereInput
  }

  export type DoctorUpdateToOneWithWhereWithoutEncountersInput = {
    where?: DoctorWhereInput
    data: XOR<DoctorUpdateWithoutEncountersInput, DoctorUncheckedUpdateWithoutEncountersInput>
  }

  export type DoctorUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorUncheckedUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUncheckedUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutDoctorNestedInput
  }

  export type PatientCreateWithoutConsentsInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    account: AccountCreateNestedOneWithoutPatientsInput
    handovers?: AriaHandoverCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutConsentsInput = {
    id?: string
    accountId: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
    handovers?: AriaHandoverUncheckedCreateNestedManyWithoutPatientInput
    queueEntries?: QueueEntryUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutConsentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
  }

  export type DoctorCreateWithoutConsentsInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryCreateNestedManyWithoutDoctorInput
    encounters?: EncounterCreateNestedManyWithoutDoctorInput
    audits?: AuditEventCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUncheckedCreateWithoutConsentsInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryUncheckedCreateNestedManyWithoutDoctorInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutDoctorInput
    audits?: AuditEventUncheckedCreateNestedManyWithoutDoctorInput
  }

  export type DoctorCreateOrConnectWithoutConsentsInput = {
    where: DoctorWhereUniqueInput
    create: XOR<DoctorCreateWithoutConsentsInput, DoctorUncheckedCreateWithoutConsentsInput>
  }

  export type PatientUpsertWithoutConsentsInput = {
    update: XOR<PatientUpdateWithoutConsentsInput, PatientUncheckedUpdateWithoutConsentsInput>
    create: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutConsentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutConsentsInput, PatientUncheckedUpdateWithoutConsentsInput>
  }

  export type PatientUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    account?: AccountUpdateOneRequiredWithoutPatientsNestedInput
    handovers?: AriaHandoverUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    handovers?: AriaHandoverUncheckedUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type DoctorUpsertWithoutConsentsInput = {
    update: XOR<DoctorUpdateWithoutConsentsInput, DoctorUncheckedUpdateWithoutConsentsInput>
    create: XOR<DoctorCreateWithoutConsentsInput, DoctorUncheckedCreateWithoutConsentsInput>
    where?: DoctorWhereInput
  }

  export type DoctorUpdateToOneWithWhereWithoutConsentsInput = {
    where?: DoctorWhereInput
    data: XOR<DoctorUpdateWithoutConsentsInput, DoctorUncheckedUpdateWithoutConsentsInput>
  }

  export type DoctorUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUpdateManyWithoutDoctorNestedInput
    encounters?: EncounterUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorUncheckedUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUncheckedUpdateManyWithoutDoctorNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutDoctorNestedInput
    audits?: AuditEventUncheckedUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorCreateWithoutAuditsInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryCreateNestedManyWithoutDoctorInput
    encounters?: EncounterCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUncheckedCreateWithoutAuditsInput = {
    id?: string
    authUserId?: string | null
    fullName: string
    email: string
    passwordHash?: string | null
    specialty: string
    registrationNo: string
    languages?: DoctorCreatelanguagesInput | string[]
    clinicName: string
    mfaEnabled?: boolean
    avatarTone?: string | null
    onboardingComplete?: boolean
    country?: string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: boolean
    lastSeenAt?: Date | string | null
    createdAt?: Date | string
    queue?: QueueEntryUncheckedCreateNestedManyWithoutDoctorInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutDoctorInput
    consents?: ConsentGrantUncheckedCreateNestedManyWithoutDoctorInput
  }

  export type DoctorCreateOrConnectWithoutAuditsInput = {
    where: DoctorWhereUniqueInput
    create: XOR<DoctorCreateWithoutAuditsInput, DoctorUncheckedCreateWithoutAuditsInput>
  }

  export type DoctorUpsertWithoutAuditsInput = {
    update: XOR<DoctorUpdateWithoutAuditsInput, DoctorUncheckedUpdateWithoutAuditsInput>
    create: XOR<DoctorCreateWithoutAuditsInput, DoctorUncheckedCreateWithoutAuditsInput>
    where?: DoctorWhereInput
  }

  export type DoctorUpdateToOneWithWhereWithoutAuditsInput = {
    where?: DoctorWhereInput
    data: XOR<DoctorUpdateWithoutAuditsInput, DoctorUncheckedUpdateWithoutAuditsInput>
  }

  export type DoctorUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUpdateManyWithoutDoctorNestedInput
    encounters?: EncounterUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorUncheckedUpdateWithoutAuditsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authUserId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    languages?: DoctorUpdatelanguagesInput | string[]
    clinicName?: StringFieldUpdateOperationsInput | string
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    country?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: NullableJsonNullValueInput | InputJsonValue
    onCall?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueEntryUncheckedUpdateManyWithoutDoctorNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutDoctorNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutDoctorNestedInput
  }

  export type PatientCreateManyAccountInput = {
    id?: string
    fullName: string
    sex: $Enums.Sex
    dateOfBirth: Date | string
    phoneMasked: string
    village: string
    district: string
    preferredLanguage: string
    abhaLinked?: boolean
    relationshipToAccount: $Enums.RelationshipRole
    allergies?: PatientCreateallergiesInput | string[]
    conditions?: PatientCreateconditionsInput | string[]
    currentMedications?: PatientCreatecurrentMedicationsInput | string[]
    avatarTone?: string | null
  }

  export type PatientUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    handovers?: AriaHandoverUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
    handovers?: AriaHandoverUncheckedUpdateManyWithoutPatientNestedInput
    queueEntries?: QueueEntryUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    consents?: ConsentGrantUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    sex?: EnumSexFieldUpdateOperationsInput | $Enums.Sex
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    phoneMasked?: StringFieldUpdateOperationsInput | string
    village?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    abhaLinked?: BoolFieldUpdateOperationsInput | boolean
    relationshipToAccount?: EnumRelationshipRoleFieldUpdateOperationsInput | $Enums.RelationshipRole
    allergies?: PatientUpdateallergiesInput | string[]
    conditions?: PatientUpdateconditionsInput | string[]
    currentMedications?: PatientUpdatecurrentMedicationsInput | string[]
    avatarTone?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QueueEntryCreateManyDoctorInput = {
    id?: string
    patientId: string
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    handoverId?: string | null
  }

  export type EncounterCreateManyDoctorInput = {
    id?: string
    patientId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
  }

  export type ConsentGrantCreateManyDoctorInput = {
    id?: string
    patientId: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
  }

  export type AuditEventCreateManyDoctorInput = {
    id?: string
    actorName: string
    action: string
    target: string
    reason?: string | null
    at?: Date | string
  }

  export type QueueEntryUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    patient?: PatientUpdateOneRequiredWithoutQueueEntriesNestedInput
    handover?: AriaHandoverUpdateOneWithoutQueueEntryNestedInput
  }

  export type QueueEntryUncheckedUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    handoverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QueueEntryUncheckedUpdateManyWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    handoverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EncounterUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
  }

  export type EncounterUncheckedUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EncounterUncheckedUpdateManyWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentGrantUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    patient?: PatientUpdateOneRequiredWithoutConsentsNestedInput
  }

  export type ConsentGrantUncheckedUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentGrantUncheckedUpdateManyWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AuditEventUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    actorName?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    target?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AriaHandoverCreateManyPatientInput = {
    id?: string
    createdAt?: Date | string
    chiefComplaint: string
    narrative: string
    durationText: string
    symptoms?: AriaHandoverCreatesymptomsInput | string[]
    redFlags?: AriaHandoverCreateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence: number
    suggestedTriage: $Enums.TriageLevel
    language: string
    verifiedByDoctor?: boolean
  }

  export type QueueEntryCreateManyPatientInput = {
    id?: string
    doctorId?: string | null
    kind: $Enums.EncounterKind
    triage: $Enums.TriageLevel
    state?: $Enums.QueueState
    checkedInAt: Date | string
    scheduledFor: Date | string
    channel: $Enums.ConsultChannel
    reason: string
    connectionQuality?: string
    handoverId?: string | null
  }

  export type EncounterCreateManyPatientInput = {
    id?: string
    doctorId: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    channel: $Enums.ConsultChannel
    chiefComplaint: string
    assessment: string
    clinicalNotes: string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: boolean
  }

  export type ConsentGrantCreateManyPatientInput = {
    id?: string
    grantedTo: string
    purpose: string
    scope?: ConsentGrantCreatescopeInput | string[]
    grantedAt?: Date | string
    expiresAt: Date | string
    active?: boolean
  }

  export type AriaHandoverUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
    queueEntry?: QueueEntryUpdateOneWithoutHandoverNestedInput
  }

  export type AriaHandoverUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
    queueEntry?: QueueEntryUncheckedUpdateOneWithoutHandoverNestedInput
  }

  export type AriaHandoverUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    narrative?: StringFieldUpdateOperationsInput | string
    durationText?: StringFieldUpdateOperationsInput | string
    symptoms?: AriaHandoverUpdatesymptomsInput | string[]
    redFlags?: AriaHandoverUpdateredFlagsInput | string[]
    vitals?: NullableJsonNullValueInput | InputJsonValue
    aiConfidence?: FloatFieldUpdateOperationsInput | number
    suggestedTriage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    language?: StringFieldUpdateOperationsInput | string
    verifiedByDoctor?: BoolFieldUpdateOperationsInput | boolean
  }

  export type QueueEntryUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    doctor?: DoctorUpdateOneWithoutQueueNestedInput
    handover?: AriaHandoverUpdateOneWithoutQueueEntryNestedInput
  }

  export type QueueEntryUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    handoverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QueueEntryUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    kind?: EnumEncounterKindFieldUpdateOperationsInput | $Enums.EncounterKind
    triage?: EnumTriageLevelFieldUpdateOperationsInput | $Enums.TriageLevel
    state?: EnumQueueStateFieldUpdateOperationsInput | $Enums.QueueState
    checkedInAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduledFor?: DateTimeFieldUpdateOperationsInput | Date | string
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    reason?: StringFieldUpdateOperationsInput | string
    connectionQuality?: StringFieldUpdateOperationsInput | string
    handoverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EncounterUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
    doctor?: DoctorUpdateOneRequiredWithoutEncountersNestedInput
  }

  export type EncounterUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    doctorId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EncounterUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    doctorId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    channel?: EnumConsultChannelFieldUpdateOperationsInput | $Enums.ConsultChannel
    chiefComplaint?: StringFieldUpdateOperationsInput | string
    assessment?: StringFieldUpdateOperationsInput | string
    clinicalNotes?: StringFieldUpdateOperationsInput | string
    prescriptions?: JsonNullValueInput | InputJsonValue
    labRequests?: JsonNullValueInput | InputJsonValue
    followUp?: NullableJsonNullValueInput | InputJsonValue
    ariaAccepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentGrantUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    doctor?: DoctorUpdateOneRequiredWithoutConsentsNestedInput
  }

  export type ConsentGrantUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    grantedTo?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ConsentGrantUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    grantedTo?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    scope?: ConsentGrantUpdatescopeInput | string[]
    grantedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}