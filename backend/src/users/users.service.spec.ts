import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('gera id e createdAt e salva o email em minúsculas', () => {
      const user = service.create({ name: 'Ana', email: 'Ana@X.com' });

      expect(user.id).toEqual(expect.any(String));
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.email).toBe('ana@x.com');
      expect(service.findAll()).toEqual([user]);
    });

    it('recusa email já cadastrado, sem diferenciar maiúsculas', () => {
      service.create({ name: 'Ana', email: 'Ana@x.com' });

      expect(() => service.create({ name: 'Ana', email: 'ana@x.com' })).toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('devolve o usuário pelo id', () => {
      const ana = service.create({ name: 'Ana', email: 'ana@x.com' });

      expect(service.findOne(ana.id)).toBe(ana);
    });

    it('lança NotFoundException para id inexistente', () => {
      expect(() => service.findOne('nao existe')).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('altera só os campos enviados', () => {
      const ana = service.create({
        name: 'Ana',
        email: 'ana@x.com',
        role: 'dev',
      });

      const updated = service.update(ana.id, { name: 'Ana Maria' });

      expect(updated).toMatchObject({
        name: 'Ana Maria',
        email: 'ana@x.com',
        role: 'dev',
      });
    });

    it('permite manter o próprio email', () => {
      const ana = service.create({ name: 'Ana', email: 'ana@x.com' });

      expect(() =>
        service.update(ana.id, { email: 'ANA@X.COM' }),
      ).not.toThrow();
    });

    it('recusa email de outro usuário', () => {
      service.create({ name: 'Ana', email: 'ana@x.com' });
      const bruno = service.create({ name: 'Bruno', email: 'bruno@x.com' });

      expect(() => service.update(bruno.id, { email: 'ana@x.com' })).toThrow(
        ConflictException,
      );
    });
  });

  it('lança NotFoundException para id inexistente', () => {
    expect(() => service.update('nao existe', { name: 'X' })).toThrow(
      NotFoundException,
    );
  });

  describe('remove', () => {
    it('tira o usuário da lista', () => {
      const ana = service.create({ name: 'Ana', email: 'ana@x.com' });

      service.remove(ana.id);

      expect(service.findAll()).toEqual([]);
    });

    it('lança NotFoundException para id inexistente', () => {
      expect(() => service.remove('nao existe')).toThrow(NotFoundException);
    });
  });
});
