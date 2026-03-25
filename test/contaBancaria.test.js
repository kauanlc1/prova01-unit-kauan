const ContaBancaria = require("../src/contaBancaria");

describe("ContaBancaria", () => {
  let conta;

  beforeEach(() => {
    conta = new ContaBancaria({
      id: 1,
      titular: "João",
      saldo: 100,
      limite: 50,
      status: "ativa",
    });
  });

  test("Deve obter saldo corretamente", () => {
    expect(conta.obterSaldo()).toBe(100);
  });

  test("Deve obter titular corretamente", () => {
    expect(conta.obterTitular()).toBe("João");
  });

  test("Deve obter status corretamente", () => {
    expect(conta.obterStatus()).toBe("ativa");
  });

  test("Deve obter limite corretamente", () => {
    expect(conta.obterLimite()).toBe(50);
  });

  test("Deve retornar true quando conta está ativa", () => {
    expect(conta.estaAtiva()).toBe(true);
  });

  test("Deve retornar false quando conta não está ativa", () => {
    conta.bloquearConta();
    expect(conta.estaAtiva()).toBe(false);
  });

  test("Deve depositar valor válido", () => {
    const resultado = conta.depositar(50);
    expect(resultado).toBe(true);
    expect(conta.obterSaldo()).toBe(150);
  });

  test("Não deve depositar valor zero", () => {
    expect(conta.depositar(0)).toBe(false);
  });

  test("Não deve depositar valor negativo", () => {
    expect(conta.depositar(-10)).toBe(false);
  });

  test("Deve sacar valor dentro do saldo", () => {
    const resultado = conta.sacar(80);
    expect(resultado).toBe(true);
    expect(conta.obterSaldo()).toBe(20);
  });

  test("Deve sacar valor usando o limite", () => {
    const resultado = conta.sacar(120);
    expect(resultado).toBe(true);
    expect(conta.obterSaldo()).toBe(-20);
  });

  test("Não deve sacar valor maior que saldo + limite", () => {
    expect(conta.sacar(200)).toBe(false);
  });

  test("Não deve sacar valor zero", () => {
    expect(conta.sacar(0)).toBe(false);
  });

  test("Não deve sacar valor negativo", () => {
    expect(conta.sacar(-10)).toBe(false);
  });

  test("Deve alterar titular", () => {
    const resultado = conta.alterarTitular("Maria");
    expect(resultado).toBe(true);
    expect(conta.obterTitular()).toBe("Maria");
  });

  test("Não deve alterar titular para string vazia", () => {
    expect(conta.alterarTitular("")).toBe(false);
  });

  test("Não deve alterar titular para null", () => {
    expect(conta.alterarTitular(null)).toBe(false);
  });

  test("Deve bloquear conta ativa", () => {
    const resultado = conta.bloquearConta();
    expect(resultado).toBe(true);
    expect(conta.obterStatus()).toBe("bloqueada");
  });

  test("Não deve bloquear conta já bloqueada", () => {
    conta.bloquearConta();
    expect(conta.bloquearConta()).toBe(false);
  });

  test("Deve ativar conta bloqueada", () => {
    conta.bloquearConta();
    const resultado = conta.ativarConta();
    expect(resultado).toBe(true);
    expect(conta.obterStatus()).toBe("ativa");
  });

  test("Não deve ativar conta já ativa", () => {
    expect(conta.ativarConta()).toBe(false);
  });

  test("Não deve encerrar conta com saldo diferente de zero", () => {
    expect(conta.encerrarConta()).toBe(false);
  });

  test("Deve encerrar conta com saldo zero", () => {
    conta.conta.saldo = 0;
    const resultado = conta.encerrarConta();
    expect(resultado).toBe(true);
    expect(conta.obterStatus()).toBe("encerrada");
  });

  test("Deve retornar true quando pode sacar", () => {
    expect(conta.podeSacar(100)).toBe(true);
  });

  test("Deve retornar false quando valor excede saldo + limite", () => {
    expect(conta.podeSacar(200)).toBe(false);
  });

  test("Deve retornar false quando valor é zero", () => {
    expect(conta.podeSacar(0)).toBe(false);
  });

  test("Deve aplicar tarifa válida", () => {
    const resultado = conta.aplicarTarifa(10);
    expect(resultado).toBe(true);
    expect(conta.obterSaldo()).toBe(90);
  });

  test("Não deve aplicar tarifa zero ou negativa", () => {
    expect(conta.aplicarTarifa(0)).toBe(false);
    expect(conta.aplicarTarifa(-5)).toBe(false);
  });

  test("Deve ajustar limite para valor válido", () => {
    const resultado = conta.ajustarLimite(200);
    expect(resultado).toBe(true);
    expect(conta.obterLimite()).toBe(200);
  });

  test("Deve ajustar limite para zero", () => {
    expect(conta.ajustarLimite(0)).toBe(true);
    expect(conta.obterLimite()).toBe(0);
  });

  test("Não deve ajustar limite negativo", () => {
    expect(conta.ajustarLimite(-1)).toBe(false);
  });

  test("Deve identificar saldo negativo", () => {
    conta.sacar(120);
    expect(conta.saldoNegativo()).toBe(true);
  });

  test("Deve retornar false quando saldo não é negativo", () => {
    expect(conta.saldoNegativo()).toBe(false);
  });

  test("Deve transferir valor entre contas", () => {
    const destino = new ContaBancaria({
      id: 2,
      titular: "Maria",
      saldo: 50,
      limite: 0,
      status: "ativa",
    });

    const resultado = conta.transferir(50, destino);
    expect(resultado).toBe(true);
    expect(conta.obterSaldo()).toBe(50);
    expect(destino.obterSaldo()).toBe(100);
  });

  test("Não deve transferir valor maior que saldo disponível", () => {
    const destino = new ContaBancaria({
      id: 2,
      titular: "Maria",
      saldo: 0,
      limite: 0,
      status: "ativa",
    });

    expect(conta.transferir(500, destino)).toBe(false);
  });

  test("Deve calcular saldo disponível corretamente", () => {
    expect(conta.calcularSaldoDisponivel()).toBe(150);
  });

  test("Deve gerar resumo correto da conta", () => {
    const resumo = conta.gerarResumo();
    expect(resumo).toEqual({
      titular: "João",
      saldo: 100,
      limite: 50,
      disponivel: 150,
      status: "ativa",
    });
  });

  test("Deve validar conta corretamente", () => {
    expect(conta.validarConta()).toBe(true);
  });

  test("Deve falhar validação se sem id", () => {
    conta.conta.id = null;
    expect(conta.validarConta()).toBe(false);
  });

  test("Deve falhar validação se sem titular", () => {
    conta.conta.titular = "";
    expect(conta.validarConta()).toBe(false);
  });

  test("Deve falhar validação se saldo não for número", () => {
    conta.conta.saldo = "cem";
    expect(conta.validarConta()).toBe(false);
  });

  test("Deve falhar validação se limite negativo", () => {
    conta.conta.limite = -1;
    expect(conta.validarConta()).toBe(false);
  });

  test("Deve falhar validação se status inválido", () => {
    conta.conta.status = "invalido";
    expect(conta.validarConta()).toBe(false);
  });

  test("Deve resetar conta corretamente", () => {
    conta.resetarConta();
    expect(conta.obterSaldo()).toBe(0);
    expect(conta.obterLimite()).toBe(0);
    expect(conta.obterStatus()).toBe("ativa");
  });
});