require 'smart_asset'
require 'fileutils'

task :default => [:all]

task :all => [:css, :js] do
end

task :js do
  puts "compressing js"
  SmartAsset.load_config Dir.pwd, 'assets.yml'
  SmartAsset.compress 'javascripts'
  Dir["#{Dir.pwd}/theme/javascripts/temp/*.js"].each do |filename|
    target_filename = filename.sub(/\/temp\/.*_/, '/')
    puts "Moving to #{target_filename}"
    FileUtils.move filename, filename.sub(/\/temp\/.*_/, '/')
  end
  puts "Removing temp folder"
  Dir.delete "#{Dir.pwd}/theme/javascripts/temp"
end

task :css do
  puts "compressing css"
  puts `compass compile`
end