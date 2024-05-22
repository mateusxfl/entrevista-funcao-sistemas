// Lista de beneficiários.
var arrBeneficiarios = []; // TODO: PREENCHER COM O QUE JA TEM DO BANCO.
var lastId = 0;

$(document).ready(function () {
    $('#formCadastro #CPF').mask('000.000.000-00', { reverse: true });
    $('#beneficiarioForm #BeneficiarioCPF').mask('000.000.000-00', { reverse: true });

    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
                "Beneficiarios": arrBeneficiarios
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })

    $('#addBeneficiarioBtn').click(function () {
        $('#beneficiarioModal').modal('show');
    });

    $('#beneficiarioForm').submit(function (event) {
        event.preventDefault();

        debugger

        var formData = {
            ClienteId: $('#ClienteId').val(),
            CPF: $('#BeneficiarioCPF').val(),
            Nome: $('#BeneficiarioNome').val()
        };

        var beneficiarios = arrBeneficiarios.filter((beneficiario) => {
            return beneficiario.CPF === formData.CPF;
        });

        if (beneficiarios.length != 0) {
            // TODO: SE ID BUSCADO FOR IGUAL AO ID QUE TA ALTERANDO DEIXA ALTERAR O BENEFICIARIO, CASO NÃO MOSTRA A MENSAGEM DE CPF DUPLICADO.
            debugger

            if (beneficiarios[0].Id == $('#BeneficiarioAlterando').val()) {
                alert('pode alterar');

                // TODO: ALTERAR E COLOCAR NA TABELA.

                $('#BeneficiarioNome').val('');
            } else {
                $('#alertMessage').text('Já existe um beneficiário com esse CPF para este cliente.');
            }
        } else {
            $('#alertMessage').text('');
            $("#btnAction").html('Incluir');

            formData.Id = ++lastId, 
            formData.State = "InMemory";
            arrBeneficiarios.push(formData);

            $('#BeneficiarioCPF').val('');
            $('#BeneficiarioNome').val('');

            var newRow = '<tr id="' + formData.Id + '">                                                                                                                                                 ' +
                '             <td>' + formData.CPF + '</td>                                                                                                                                              ' +
                '             <td>' + formData.Nome + '</td>                                                                                                                                             ' +
                '             <td>                                                                                                                                                                       ' +
                '                  <button type="button" class="btn btn-sm btn-primary" onclick="AlterarBeneficiario(this.value)" id="editBeneficiarioBtn" value="' + formData.Id + '">Alterar</button>' +
                '                  <button type="button" class="btn btn-sm btn-primary" onclick="DeletarBeneficiario(this.value)" id="delBeneficiarioBtn" value="' + formData.Id + '">Excluir</button> ' +
                '             </td>                                                                                                                                                                      ' +
                '         </tr>                                                                                                                                                                          ';

            $('#tabelaBeneficiarios tbody').append(newRow);
        }
    });
})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function AlterarBeneficiario(id) {
    var beneficiarioClicado = arrBeneficiarios.find(x => x.Id == id);

    $('#BeneficiarioCPF').val(beneficiarioClicado.CPF);
    $('#BeneficiarioNome').val(beneficiarioClicado.Nome);
    $('#BeneficiarioAlterando').val(beneficiarioClicado.Id);

    $("#btnAction").html('Alterar');
}

function DeletarBeneficiario(id) {
    $('#tabelaBeneficiarios #' + id + '').remove();

    debugger

    // TOOD: REMOVER DO ARR CASO O BENEFICIARIO ESTEJA APENAS EM MEMORIA.

    var beneficiarioParaRemover = arrBeneficiarios.filter((beneficiario) => {
        return beneficiario.Id === id;
    });

    beneficiarioParaRemover[0].Action = "Remover";
}