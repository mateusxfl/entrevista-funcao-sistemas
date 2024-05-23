
// Lista de beneficiários.
var arrBeneficiarios = [];
console.log('VINDOS DO BANCO', arrBeneficiarios);

$(document).ready(function () {
    $('#formCadastro #CPF').mask('000.000.000-00', { reverse: true });
    $('#beneficiarioForm #BeneficiarioCPF').mask('000.000.000-00', { reverse: true });

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
            }
        });
    })

    $('#addBeneficiarioBtn').click(function () {
        $('#beneficiarioModal').modal('show');

    });

    $('#beneficiarioForm').submit(function (event) {
        event.preventDefault();

        var formData = {
            CPF: $('#BeneficiarioCPF').val(),
            Nome: $('#BeneficiarioNome').val()
        };

        var index = arrBeneficiarios.findIndex(function (beneficiario) {
            return beneficiario.CPF == formData.CPF;
        });

        if (index !== -1) {
            var beneficiarioParaEditar = arrBeneficiarios[index];

            // Validação para permitir CPF "duplicar" no cenário em que a atualização se trata do beneficiário que já tem esse CPF.
            if (beneficiarioParaEditar.Id == $('#BeneficiarioAlterando').val()) {
                $("#btnAction").html('Incluir');

                beneficiarioParaEditar.CPF = formData.CPF;
                beneficiarioParaEditar.Nome = formData.Nome;

                $('#tabelaBeneficiarios #' + beneficiarioParaEditar.Id).find('td:nth-child(1)').text(beneficiarioParaEditar.CPF);
                $('#tabelaBeneficiarios #' + beneficiarioParaEditar.Id).find('td:nth-child(2)').text(beneficiarioParaEditar.Nome);

                console.log('ALTERADO', arrBeneficiarios);
            } else {
                $('#alertMessage').text('Já existe um beneficiário com esse CPF para este cliente.');
                return;
            }
        } else {
            $("#btnAction").html('Incluir');

            formData.Id = generateSimpleRandomId();
            arrBeneficiarios.push(formData);

            var newRow = '<tr id="' + formData.Id + '">                                                                                                                                                                          ' +
                '             <td>' + formData.CPF + '</td>                                                                                                                                                                      ' +
                '             <td>' + formData.Nome + '</td>                                                                                                                                                                     ' +
                '             <td>                                                                                                                                                                                               ' +
                '                  <button type="button" class="btn btn-sm btn-primary" onclick="AlterarBeneficiario(this.value)" id="editBeneficiarioBtn" value="' + formData.Id + '">Alterar</button>                          ' +
                '                  <button type="button" class="btn btn-sm btn-primary" onclick="DeletarBeneficiario(this.value)" id="delBeneficiarioBtn" value="' + formData.Id + '" style="margin-left: 10px">Excluir</button> ' +
                '             </td>                                                                                                                                                                                              ' +
                '         </tr>                                                                                                                                                                                                  ';

            $('#tabelaBeneficiarios tbody').append(newRow);

            console.log('CADASTRADO', arrBeneficiarios);
        }

        $('#BeneficiarioCPF').val('');
        $('#BeneficiarioNome').val('');
        $('#alertMessage').text('');
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
    $('#tabelaBeneficiarios #' + id).remove();

    var index = arrBeneficiarios.findIndex(function (beneficiario) {
        return beneficiario.Id == id;
    });

    if (index !== -1) {
        var beneficiarioParaRemover = arrBeneficiarios[index];
        arrBeneficiarios.splice(index, 1);
    }

    console.log('REMOÇÃO', arrBeneficiarios);
}

function generateSimpleRandomId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}