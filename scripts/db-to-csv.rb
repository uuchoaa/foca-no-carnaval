#!/usr/bin/env ruby
require 'csv'

def parse_carnival_events(input_file, output_file = 'eventos_carnaval.csv')
  events = []
  
  File.readlines(input_file).each do |line|
    line = line.strip
    
    # Ignora linhas vazias ou que contêm apenas números
    next if line.empty? || line.match?(/^\d+$/)
    
    # Parse da linha de evento (separada por tabs)
    parts = line.split("\t")
    
    # Verifica se tem pelo menos os campos principais
    next unless parts.length >= 7
    
    event = {
      dia_semana: parts[0],
      data: parts[1],
      hora_inicio: parts[2],
      hora_fim: parts[3],
      cidade: parts[4],
      evento: parts[5],
      local: parts[6],
      observacao: parts[7] || '-'
    }
    
    events << event
  end
  
  # Gera o CSV
  CSV.open(output_file, 'w') do |csv|
    # Cabeçalho
    csv << events.first.keys
    
    # Dados
    events.each do |event|
      csv << event.values
    end
  end
  
  puts "Arquivo CSV gerado: #{output_file}"
  puts "Total de eventos processados: #{events.length}"
end

# Uso do script
if ARGV.empty?
  puts "Uso: ruby carnival_parser.rb <arquivo_entrada> [arquivo_saida.csv]"
  exit 1
end

input_file = ARGV[0]
output_file = ARGV[1] || 'eventos_carnaval.csv'

unless File.exist?(input_file)
  puts "Arquivo não encontrado: #{input_file}"
  exit 1
end

parse_carnival_events(input_file, output_file)